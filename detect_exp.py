import sys
import cv2
import pytesseract
import re
import requests

# Set stdout encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

def img_to_text(image_path):
    path_to_tesseract = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    pytesseract.pytesseract.tesseract_cmd = path_to_tesseract
    custom_config = r'--oem 1 --psm 6 -l tha+eng'  # Thai and English language

    # Load and preprocess the image
    image = cv2.imread(image_path)
    # preprocessed_image = preprocess_image(image)

    # Extract text using pytesseract
    text = pytesseract.image_to_string(image, config=custom_config)
    text = text.replace(".", "").replace("/", "")

    return text

def find_exp(text, target_words):
    results = {}
    text_lower = text.lower()

    for word in target_words:
        word_lower = word.lower()
        # ค้นหาตัวเลขที่ตามหลังคำค้นหา
        matches = re.findall(rf'{word_lower}\s*(\d+)', text_lower)
        if matches:
            results["exp"] = matches
            break
        else:
            results[word] = None

    return results

def send_to_api(image_path, text):
    api_url = "http://localhost:5555/food"  # Replace with your API endpoint
    with open(image_path, 'rb') as image_file:
        files = {'file': image_file}
        data = {
            'name': "-",
            'exp': text,
            'amount': 1,
        }
        response = requests.post(api_url, data=data, files=files)
    
    if response.status_code == 201:
        print("Text and image successfully sent to API")
    else:
        print(f"Failed to send text and image to API. Status code: {response.status_code}")
        print("Response:", response.text)

# defind image path
image_path = 'temporary_img.jpg'
# ตั้งค่าการจับภาพจากกล้อง
camera = cv2.VideoCapture(0)
while True:
    _, image = camera.read()
    cv2.imshow('Text detection', image)
    if cv2.waitKey(1) & 0xFF == ord('s'):
        cv2.imwrite(image_path, image)
        break
camera.release()
cv2.destroyAllWindows()


# เรียกใช้ Tesseract เพื่อดึงข้อความจากภาพที่จับ
text_result = img_to_text(image_path)
print(text_result)

# กำหนดคำค้นหาหลายคำ
target_words = ['exp', 'วันที่ควรบริโภค']

# ค้นหาตัวเลขหลังคำค้นหา
numbers_result = find_exp(text_result, target_words)
print("Numbers after target words:")
print(numbers_result)

if "exp" in numbers_result and numbers_result["exp"]:
    send_to_api(image_path, numbers_result['exp'][0])
else:
    print("No expiration date found.")

