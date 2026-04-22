# Media Object Documentation

## Overview

The `media` object serves as an abstract representation that encompasses four distinct media types:

- `image`
- `model`
- `video`
- `external_video`

This object can be accessed through the `product.media` array or a `file_reference` metafield.

## Key Characteristics

"You can use media filters to generate URLs and media displays." The documentation recommends consulting the media support guide for implementation guidance within themes.

## Properties

### alt
- **Type:** string
- **Description:** The alternative text describing the media content.

### id
- **Type:** number
- **Description:** Unique identifier for the media item.

### media_type
- **Type:** string (enumerated values)
- **Possible values:** `image`, `model`, `video`, `external_video`
- **Usage example:** Filter product media using the `where` filter with this property to isolate specific media types.

### position
- **Type:** number
- **Description:** Indicates placement within the product's media collection. Returns `nil` when sourced from a `file_reference` metafield.

### preview_image
- **Type:** image object
- **Description:** Thumbnail representation of the media. "Preview images don't have an ID attribute."

## Example Data Structure

```json
{
  "alt": "Dandelion milk",
  "id": 21772527435841,
  "media_type": "image",
  "position": 1,
  "preview_image": {}
}
```
