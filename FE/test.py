import paho.mqtt.client as mqtt
import time
import random

# Thông tin kết nối tới MQTT broker
mqtt_broker = "127.0.0.1"
mqtt_port = 1883
mqtt_topic = "data"
# mqtt_username = "your_username"
# mqtt_password = "your_password"

# Callback khi kết nối thành công
def on_connect(client, userdata, flags, rc):
    print("Connected with Code: " + str(rc))

# Tạo một MQTT client
client = mqtt.Client()

# Gán các callback
client.on_connect = on_connect

# Thiết lập thông tin xác thực nếu cần
# client.username_pw_set(mqtt_username, mqtt_password)

# Kết nối tới MQTT broker
client.connect(mqtt_broker, mqtt_port, 60)

# Lặp để duy trì kết nối
client.loop_start()

# Hàm để tạo và xuất bản dữ liệu ngẫu nhiên
def publish_random_data():
    while True:
        temperature = round(random.uniform(20.0, 40.0),2)  # Nhiệt độ ngẫu nhiên từ 20 đến 30 độ C
        humidity = round(random.uniform(40.0, 80.0),2)  # Độ ẩm ngẫu nhiên từ 40% đến 60%
        light = random.randint(0, 1000)  # Ánh sáng ngẫu nhiên từ 0 đến 1000 lux

        message = f"Temperature: {temperature} °C, Humidity: {humidity}%, Light: {light} lux"
        client.publish(mqtt_topic, message)  # Xuất bản thông điệp

        time.sleep(2)  # Chờ 2 giây trước khi xuất bản thông điệp tiếp theo

try:
    publish_random_data()
except KeyboardInterrupt:
    client.disconnect()
    client.loop_stop()