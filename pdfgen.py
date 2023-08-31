from PIL import Image
from fpdf import FPDF
import os

def convert_images_to_pdf(image_path, output_pdf_path):
    pdf = FPDF()


    img = Image.open(image_path)
    width, height = img.size
    pdf.add_page()
        
    pdf.image(image_path, x=0, y=0, w=pdf.w, h=pdf.h)

    pdf.output(output_pdf_path)

if __name__ == "__main__":
    image_folder = "/Users/matt/Downloads/IMG_0142.jpg"
    output_pdf_path = "/Users/matt/Downloads/offer.pdf"
    convert_images_to_pdf(image_folder, output_pdf_path)
