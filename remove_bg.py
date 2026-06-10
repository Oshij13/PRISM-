from PIL import Image

def remove_background(image_path, output_path):
    img = Image.open(image_path)
    rgba = img.convert("RGBA")
    datas = rgba.getdata()
    
    newData = []
    for item in datas:
        r, g, b, a = item
        # If the pixel is very dark/black, make it transparent
        # We use a threshold of 12 to capture near-black compression artifacts
        if r < 12 and g < 12 and b < 12:
            newData.append((0, 0, 0, 0))
        else:
            # For pixels near the threshold, apply a smooth alpha gradient
            brightness = max(r, g, b)
            if brightness < 30:
                # Smooth transition
                alpha = int((brightness - 12) / (30 - 12) * 255)
                alpha = max(0, min(255, alpha))
                newData.append((r, g, b, alpha))
            else:
                newData.append((r, g, b, 255))
                
    rgba.putdata(newData)
    
    # Crop the image to the bounding box of the logo to remove unnecessary transparent padding
    bbox = rgba.getbbox()
    if bbox:
        cropped = rgba.crop(bbox)
        # Resize to a standard 128x128 or 256x256 for optimal loading speed and sharp top-bar rendering
        cropped.thumbnail((256, 256), Image.Resampling.LANCZOS)
        cropped.save(output_path, "PNG")
        print("Success! Logo saved to", output_path)
    else:
        rgba.save(output_path, "PNG")
        print("Success (uncropped)! Logo saved to", output_path)

if __name__ == "__main__":
    remove_background(
        "d:/Product Management BITSoM/Capstone Project Guideline/PRISM/src/app/components/media__1779614355504.jpg",
        "d:/Product Management BITSoM/Capstone Project Guideline/PRISM/src/app/components/logo_transparent.png"
    )
