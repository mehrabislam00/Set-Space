export const MAX_IMAGE_UPLOAD_BYTES = 1_048_576
export const IMAGE_UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"

export class ImageUploadValidationError extends Error {
  constructor(
    message: string,
    readonly reason: "too-large" | "unsupported"
  ) {
    super(message)
    this.name = "ImageUploadValidationError"
  }
}

const allowedElements = new Set([
  "svg",
  "g",
  "defs",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "lineargradient",
  "radialgradient",
  "stop",
  "clippath",
  "mask",
  "pattern",
  "symbol",
  "use",
  "title",
  "desc",
  "text",
  "tspan",
])

const allowedAttributes = new Set([
  "xmlns",
  "xmlns:xlink",
  "id",
  "width",
  "height",
  "viewbox",
  "preserveaspectratio",
  "d",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "points",
  "fill",
  "fill-rule",
  "clip-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-dashoffset",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "transform",
  "offset",
  "stop-color",
  "stop-opacity",
  "gradientunits",
  "gradienttransform",
  "spreadmethod",
  "clippathunits",
  "maskunits",
  "maskcontentunits",
  "patternunits",
  "patterncontentunits",
  "patterntransform",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "dominant-baseline",
  "href",
  "xlink:href",
])

function invalidImage() {
  return new ImageUploadValidationError(
    "Invalid file format. Please select a supported image.",
    "unsupported"
  )
}

function sanitizeSvg(source: string) {
  if (/<!DOCTYPE|<!ENTITY/i.test(source)) throw invalidImage()

  const document = new DOMParser().parseFromString(source, "image/svg+xml")
  const root = document.documentElement
  if (!root || root.localName.toLowerCase() !== "svg") throw invalidImage()

  function clean(element: Element) {
    for (const child of Array.from(element.childNodes)) {
      if (
        child.nodeType === Node.COMMENT_NODE ||
        child.nodeType === Node.PROCESSING_INSTRUCTION_NODE
      ) {
        element.removeChild(child)
        continue
      }

      if (child.nodeType !== Node.ELEMENT_NODE) continue
      const childElement = child as Element
      if (!allowedElements.has(childElement.localName.toLowerCase())) {
        element.removeChild(childElement)
        continue
      }
      clean(childElement)
    }

    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim()
      const localReference = /^#[\w:.-]+$/.test(value)
      const localUrl = /^url\(\s*(['"]?)#[\w:.-]+\1\s*\)$/i.test(value)
      const invalidUrl = /url\s*\(/i.test(value) && !localUrl

      if (
        !allowedAttributes.has(name) ||
        (name === "xmlns" && value !== "http://www.w3.org/2000/svg") ||
        (name === "xmlns:xlink" && value !== "http://www.w3.org/1999/xlink") ||
        ((name === "href" || name === "xlink:href") && !localReference) ||
        invalidUrl ||
        /javascript:|data:/i.test(value)
      ) {
        element.removeAttributeNode(attribute)
      }
    }
  }

  if (!root.hasAttribute("xmlns")) {
    root.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  }
  clean(root)
  return new XMLSerializer().serializeToString(root)
}

function detectRasterType(bytes: Uint8Array) {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg"
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png"
  }
  if (
    bytes.length >= 6 &&
    ["GIF87a", "GIF89a"].includes(
      new TextDecoder().decode(bytes.subarray(0, 6))
    )
  ) {
    return "image/gif"
  }
  if (
    bytes.length >= 12 &&
    new TextDecoder().decode(bytes.subarray(0, 4)) === "RIFF" &&
    new TextDecoder().decode(bytes.subarray(8, 12)) === "WEBP"
  ) {
    return "image/webp"
  }
  return null
}

export async function validateImageFile(file: File) {
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new ImageUploadValidationError(
      "Image size is too large. Please upload an image no larger than 1 MB.",
      "too-large"
    )
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const rasterType = detectRasterType(bytes)
  if (rasterType) {
    return new File([bytes], file.name, {
      type: rasterType,
      lastModified: file.lastModified,
    })
  }

  try {
    const source = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
    const sanitizedSvg = sanitizeSvg(source)
    const sanitizedBytes = new TextEncoder().encode(sanitizedSvg)
    if (sanitizedBytes.length > MAX_IMAGE_UPLOAD_BYTES) throw invalidImage()
    return new File([sanitizedBytes], file.name, {
      type: "image/svg+xml",
      lastModified: file.lastModified,
    })
  } catch (error) {
    if (error instanceof ImageUploadValidationError) throw error
    throw invalidImage()
  }
}
