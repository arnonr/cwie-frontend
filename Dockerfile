FROM nginx:latest

# ลบไฟล์ default configuration
RUN rm /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ configuration ของคุณ
COPY nginx.conf /etc/nginx/conf.d/

# คัดลอกไฟล์เว็บไซต์ของคุณ (ถ้ามี)
COPY ./dist /usr/share/nginx/html

# เปิด port 80
EXPOSE 80

# รัน nginx
CMD ["nginx", "-g", "daemon off;"]