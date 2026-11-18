import type { StudioFormData } from "@/lib/Host-data"
import type { WeeklyOpeningHours } from "@/lib/Opening-hours"
import type { NotificationType } from "@/lib/Site-data"

export type UserProfile = {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  location: string
  bio: string
  image: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type ProfileUser = {
  id: string
  name: string
  email: string
  image: string | null
  emailVerified: boolean
  createdAt: string | null
}

export type ProfileStats = {
  bookings: number
  listings: number
  memberSince: number
}

export type MarketplaceDashboardStats = {
  renter: {
    totalBookings: number
    savedStudios: number
    upcomingBookings: number
    totalSpent: number
  }
  host: {
    totalStudios: number
    totalBookings: number
    pendingRequests: number
    earnings: number
    monthlyEarnings: { month: string; amount: number }[]
  }
}

export type ProfileResponse = {
  profile: UserProfile
  user: ProfileUser
  stats: ProfileStats
}

export type ProfileMutationResponse = {
  profile: UserProfile
  created: boolean
}

export type HostOnboardingStatus = {
  onboardingCompleted: boolean
  hasHostedStudio: boolean
  profileComplete: boolean
  missingFields: "name"[]
  currentStep: number
  completedSteps: number[]
}

export type MarketplaceRecord = {
  id: string
  [key: string]: unknown
}

export type MarketplaceBookingStatus =
  "Pending" | "Confirmed" | "Rejected" | "Completed" | "Cancelled"

export type MarketplaceBooking = MarketplaceRecord & {
  studioId: string
  ownerId: string
  renterId: string
  renterName: string
  studioName: string
  studioLocation: string
  studioImage: string | null
  hostName: string
  bookingDate: string
  startTime: string
  endTime: string
  durationHours: number
  guests: number
  hourlyRate: number
  subtotal: number
  serviceFee: number
  total: number
  status: MarketplaceBookingStatus
  createdAt: string
  updatedAt: string
}

export type MarketplaceReview = MarketplaceRecord & {
  studioId: string
  reviewerName: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export type MarketplaceNotification = MarketplaceRecord & {
  type: NotificationType
  title: string
  body: string
  href: string
  isRead: boolean
  createdAt: string
}

export type ReviewEligibility = {
  canReview: boolean
  bookingId: string | null
  bookingDate: string | null
}

export type StudioRecord = MarketplaceRecord & {
  ownerId?: string
  name: string
  category: string
  categoryLabel: string
  discipline: string
  city: string
  location: string
  price: number
  status: "draft" | "published" | "active"
  featured: boolean
  rating: number
  reviews: number
  image: string | null
  photos: string[]
  details: Omit<StudioFormData, "openingHours"> & {
    openingHours?: WeeklyOpeningHours
  }
  ownerName: string
  ownerCreatedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export class MarketplaceApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string
  ) {
    super(message)
    this.name = "MarketplaceApiError"
  }
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "")

export const NOTIFICATIONS_REFRESH_EVENT = "setspace:notifications-refresh"
export const DASHBOARD_STATS_REFRESH_EVENT = "setspace:dashboard-stats-refresh"
export const MARKETPLACE_API_ERROR_EVENT = "setspace:marketplace-api-error"

function announceApiError(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(MARKETPLACE_API_ERROR_EVENT, { detail: { message } })
    )
  }
}

function friendlyApiError(
  status: number,
  code: string | undefined,
  path: string
) {
  const imageRequest = path.startsWith("/api/profile/image")

  if (status === 413 || code === "PROFILE_IMAGE_TOO_LARGE") {
    return imageRequest
      ? "Image size is too large. Please upload an image no larger than 1 MB."
      : "This request is too large. Please reduce the file size and try again."
  }

  if (
    imageRequest &&
    (status === 415 ||
      code === "UNSUPPORTED_PROFILE_IMAGE_TYPE" ||
      code === "INVALID_PROFILE_IMAGE" ||
      code === "UNSUPPORTED_PROFILE_IMAGE_ENCODING" ||
      code === "INVALID_PROFILE_IMAGE_BODY")
  ) {
    return "Invalid file format. Please select a supported image."
  }

  if (imageRequest && code === "PROFILE_IMAGE_REQUIRED") {
    return "Please select a profile image."
  }

  if (code === "INVALID_JSON") {
    return "The request could not be read. Please check the form and try again."
  }

  if (status === 401) return "Please sign in again to continue."
  if (status === 403) return "You don't have permission to do that."
  if (status === 409)
    return "This information has changed. Refresh and try again."
  if (status === 400 || status === 422) {
    return "Please check the required fields and try again."
  }
  if (status >= 500) return "Something went wrong. Please try again."
  return "We couldn't complete your request. Please try again."
}

function invalidApiResponse(notify = true) {
  const message = "Something went wrong. Please try again."
  if (notify) announceApiError(message)
  return new MarketplaceApiError(message, 502, "INVALID_API_RESPONSE")
}

function announceNotificationsRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFICATIONS_REFRESH_EVENT))
  }
}

function announceDashboardStatsRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DASHBOARD_STATS_REFRESH_EVENT))
  }
}

export function getProfileImageUrl(image: string | null) {
  if (!image) return null
  return image.startsWith("/api/profile/image")
    ? `${API_BASE_URL}${image}`
    : image
}

export function getStudioImageUrl(image: string | null) {
  if (!image) return null
  return image.startsWith("/api/studios/") ? `${API_BASE_URL}${image}` : image
}

export function isMarketplaceStudioId(id: string | number): id is string {
  return typeof id === "string" && /^[a-f\d]{24}$/.test(id)
}

export async function submitContactMessage(input: {
  name: string
  email: string
  topic: string
  message: string
}) {
  const response = await request<{
    success: true
    data: { received: boolean }
  }>("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.success || response.data?.received !== true) {
    throw invalidApiResponse()
  }
}

export async function subscribeToNewsletter(email: string) {
  const response = await request<{
    success: true
    data: { subscribed: boolean; alreadySubscribed: boolean }
  }>("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  if (
    !response.success ||
    response.data?.subscribed !== true ||
    typeof response.data.alreadySubscribed !== "boolean"
  ) {
    throw invalidApiResponse()
  }
  return response.data
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  signal?: AbortSignal
): Promise<T> {
  let response: Response
  const shouldNotify = !["GET", "HEAD"].includes(
    (init.method ?? "GET").toUpperCase()
  )

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      cache: "no-store",
      signal,
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error
    const message =
      "Could not connect. Please check your connection and try again."
    if (shouldNotify) announceApiError(message)
    throw new MarketplaceApiError(message, 0, "NETWORK_ERROR")
  }

  const body: unknown = await response.json().catch(() => null)
  const result =
    body && typeof body === "object" ? (body as Record<string, unknown>) : null

  if (!response.ok) {
    const code = typeof result?.code === "string" ? result.code : undefined
    const message =
      path === "/api/profile" && code === "PROFILE_NOT_FOUND"
        ? "Profile not found."
        : friendlyApiError(response.status, code, path)
    if (
      shouldNotify &&
      !(path === "/api/profile" && code === "PROFILE_NOT_FOUND")
    ) {
      announceApiError(message)
    }
    throw new MarketplaceApiError(message, response.status, code)
  }

  if (result === null) {
    throw invalidApiResponse(shouldNotify)
  }

  return body as T
}

export async function getMyProfile(
  signal?: AbortSignal
): Promise<ProfileResponse> {
  try {
    return await request<ProfileResponse>("/api/profile", {}, signal)
  } catch (error) {
    if (
      !(error instanceof MarketplaceApiError) ||
      error.status !== 404 ||
      error.code !== "PROFILE_NOT_FOUND"
    ) {
      throw error
    }

    await request<ProfileMutationResponse>(
      "/api/profile",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      },
      signal
    )

    return request<ProfileResponse>("/api/profile", {}, signal)
  }
}

function isHostOnboardingStatus(value: unknown): value is HostOnboardingStatus {
  return (
    isRecord(value) &&
    typeof value.onboardingCompleted === "boolean" &&
    typeof value.hasHostedStudio === "boolean" &&
    typeof value.profileComplete === "boolean" &&
    Array.isArray(value.missingFields) &&
    value.missingFields.every((field) => field === "name") &&
    Number.isInteger(value.currentStep) &&
    Number(value.currentStep) >= 0 &&
    Number(value.currentStep) < 8 &&
    Array.isArray(value.completedSteps) &&
    value.completedSteps.every(
      (step) => Number.isInteger(step) && Number(step) >= 1 && Number(step) <= 8
    )
  )
}

export async function getHostOnboardingStatus(signal?: AbortSignal) {
  const response = await request<{
    success: boolean
    data?: unknown
  }>("/api/host/onboarding", {}, signal)
  if (!response.success || !isHostOnboardingStatus(response.data)) {
    throw invalidApiResponse(false)
  }
  return response.data
}

export async function completeHostOnboarding() {
  const response = await request<{
    success: boolean
    data?: unknown
  }>("/api/host/onboarding/complete", { method: "POST" })
  if (!response.success || !isHostOnboardingStatus(response.data)) {
    throw invalidApiResponse()
  }
  return response.data
}

export async function updateHostOnboardingProgress(step: number) {
  const response = await request<{
    success: boolean
    data?: unknown
  }>("/api/host/onboarding/progress", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step }),
  })
  if (!response.success || !isHostOnboardingStatus(response.data)) {
    throw invalidApiResponse()
  }
  return response.data
}

export async function updateMyProfile(
  values: Pick<UserProfile, "name" | "phone" | "location" | "bio">
): Promise<ProfileMutationResponse> {
  return request<ProfileMutationResponse>("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })
}

export async function uploadMyProfileImage(
  file: File
): Promise<ProfileMutationResponse> {
  return request<ProfileMutationResponse>("/api/profile/image", {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })
}

type CollectionResponse<T> = {
  success: true
  data: T[]
}

async function getCollection<T extends MarketplaceRecord>(
  path: string,
  signal?: AbortSignal
): Promise<T[]> {
  const response = await request<CollectionResponse<T>>(path, {}, signal)
  if (!response.success || !Array.isArray(response.data)) {
    throw invalidApiResponse(false)
  }
  return response.data
}

export function getStudios(signal?: AbortSignal) {
  return getCollection<StudioRecord>("/api/studios", signal)
}

export function getMyStudios(signal?: AbortSignal) {
  return getCollection<StudioRecord>("/api/studios/mine", signal)
}

export function getMyWishlist(signal?: AbortSignal) {
  return getCollection<StudioRecord>("/api/wishlists", signal)
}

export async function saveStudioToWishlist(studioId: string) {
  const response = await request<{
    success: true
    data: StudioRecord
  }>("/api/wishlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studioId }),
  })
  if (!response.success || !response.data?.id) {
    throw invalidApiResponse()
  }
  announceDashboardStatsRefresh()
  return response.data
}

export async function removeStudioFromWishlist(studioId: string) {
  const response = await request<{ success: true }>(
    `/api/wishlists/${encodeURIComponent(studioId)}`,
    { method: "DELETE" }
  )
  if (!response.success) {
    throw invalidApiResponse()
  }
  announceDashboardStatsRefresh()
}

async function getStudioRecord(
  path: string,
  init?: RequestInit,
  signal?: AbortSignal
) {
  const response = await request<{
    success: true
    data: StudioRecord
  }>(path, init, signal)
  if (
    !response.success ||
    !response.data ||
    typeof response.data.id !== "string"
  ) {
    throw invalidApiResponse((init?.method ?? "GET").toUpperCase() !== "GET")
  }
  return response.data
}

export function getStudioById(id: string, signal?: AbortSignal) {
  return getStudioRecord(`/api/studios/${encodeURIComponent(id)}`, {}, signal)
}

export async function getStudioContactPhone(id: string) {
  const response = await request<{
    success: true
    data?: { phone?: unknown }
  }>(`/api/studios/${encodeURIComponent(id)}/contact`)
  if (
    !response.success ||
    !response.data ||
    !("phone" in response.data) ||
    (response.data.phone !== null && typeof response.data.phone !== "string")
  ) {
    throw invalidApiResponse(false)
  }
  return response.data.phone
}

export function getMyStudioById(id: string, signal?: AbortSignal) {
  return getStudioRecord(
    `/api/studios/mine/${encodeURIComponent(id)}`,
    {},
    signal
  )
}

export function createStudio(
  details: StudioFormData,
  status: "draft" | "published"
) {
  return getStudioRecord("/api/studios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ details, status }),
  })
}

export function updateStudio(
  id: string,
  details: StudioFormData,
  status?: "draft" | "published"
) {
  return getStudioRecord(`/api/studios/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ details, status }),
  })
}

export function updateStudioStatus(id: string, status: "draft" | "published") {
  return getStudioRecord(`/api/studios/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
}

export async function deleteStudio(id: string) {
  const response = await request<{ success: true }>(
    `/api/studios/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )
  if (!response.success) {
    throw invalidApiResponse()
  }
}

export function getBookings(role?: "renter" | "host", signal?: AbortSignal) {
  const query = role ? `?role=${role}` : ""
  return getCollection<MarketplaceBooking>(`/api/bookings${query}`, signal)
}

export async function createBooking(input: {
  studioId: string
  bookingDate: string
  startTime: string
  endTime: string
  guests: number
}) {
  const response = await request<{
    success: true
    data: MarketplaceBooking
  }>("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.success || !response.data?.id) {
    throw invalidApiResponse()
  }
  announceDashboardStatsRefresh()
  announceNotificationsRefresh()
  return response.data
}

export async function updateBookingStatus(
  id: string,
  status: MarketplaceBookingStatus
) {
  const response = await request<{
    success: true
    data: MarketplaceBooking
  }>(`/api/bookings/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!response.success || !response.data?.id) {
    throw invalidApiResponse()
  }
  announceDashboardStatsRefresh()
  announceNotificationsRefresh()
  return response.data
}

export function getMyNotifications(signal?: AbortSignal) {
  return getCollection<MarketplaceNotification>("/api/notifications", signal)
}

export async function markNotificationRead(id: string) {
  const response = await request<{ success: true }>(
    `/api/notifications/${encodeURIComponent(id)}/read`,
    { method: "PATCH" }
  )
  if (!response.success) {
    throw invalidApiResponse()
  }
}

export async function markAllNotificationsRead() {
  const response = await request<{ success: true }>(
    "/api/notifications/read-all",
    { method: "PATCH" }
  )
  if (!response.success) {
    throw invalidApiResponse()
  }
}

export async function deleteMyNotification(id: string) {
  const response = await request<{ success: true }>(
    `/api/notifications/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )
  if (!response.success) {
    throw invalidApiResponse()
  }
}

export function getReviews(studioId: string, signal?: AbortSignal) {
  const query = new URLSearchParams({ studioId })
  return getCollection<MarketplaceReview>(`/api/reviews?${query}`, signal)
}

export async function getReviewEligibility(
  studioId: string,
  signal?: AbortSignal
) {
  const query = new URLSearchParams({ studioId })
  const response = await request<{
    success: true
    data: ReviewEligibility
  }>(`/api/reviews/eligibility?${query}`, {}, signal)
  if (
    !response.success ||
    !response.data ||
    typeof response.data.canReview !== "boolean" ||
    (response.data.canReview && typeof response.data.bookingId !== "string")
  ) {
    throw invalidApiResponse(false)
  }
  return response.data
}

export async function createReview(input: {
  studioId: string
  bookingId: string
  rating: number
  comment: string
}) {
  const response = await request<{
    success: true
    data: MarketplaceReview
  }>("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.success || !response.data?.id) {
    throw invalidApiResponse()
  }
  announceNotificationsRefresh()
  return response.data
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) >= 0
}

function isAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

function isDashboardStats(value: unknown): value is MarketplaceDashboardStats {
  if (!isRecord(value) || !isRecord(value.renter) || !isRecord(value.host)) {
    return false
  }

  const { renter, host } = value
  if (
    !isCount(renter.totalBookings) ||
    !isCount(renter.savedStudios) ||
    !isCount(renter.upcomingBookings) ||
    !isAmount(renter.totalSpent) ||
    !isCount(host.totalStudios) ||
    !isCount(host.totalBookings) ||
    !isCount(host.pendingRequests) ||
    !isAmount(host.earnings) ||
    !Array.isArray(host.monthlyEarnings)
  ) {
    return false
  }

  return host.monthlyEarnings.every(
    (month) =>
      isRecord(month) &&
      typeof month.month === "string" &&
      isAmount(month.amount)
  )
}

export async function getMyStats(signal?: AbortSignal) {
  const response = await request<{
    success: true
    data: MarketplaceDashboardStats
  }>("/api/stats", {}, signal)
  if (!response.success || !isDashboardStats(response.data)) {
    throw invalidApiResponse(false)
  }
  return response.data
}
