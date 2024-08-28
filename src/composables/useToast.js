import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function showToast(
  text,
  type,
  gravity = "top",
  position = "center"
) {
  const styles = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(147deg, #c62128 0%, #a00000 74%)",
    warning: "linear-gradient(to right, #ffa726, #fb8c00)",
    info: "linear-gradient(to right, #2196f3, #1976d2)",
  };

  //   Toastify({
  //     text: text,
  //     duration: 3000,
  //     //   destination: "https://github.com/apvarun/toastify-js",
  //     newWindow: true,
  //     close: true,
  //     gravity: gravity, // `top` or `bottom`
  //     position: position, // `left`, `center` or `right`
  //     stopOnFocus: true, // Prevents dismissing of toast on hover
  //     style: style,
  //     onClick: function () {}, // Callback after click
  //   }).showToast();

  const toast = Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: gravity, // `top` or `bottom`
    position: position, // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: styles[type] || styles.success,
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  // ปรับตำแหน่ง Toastify ให้กลางหน้าจอทั้งแนวตั้งและแนวนอน
  const toastElement = document.querySelector(".toastify");
  if (toastElement) {
    toastElement.style.top = "50%";
    toastElement.style.transform = "translateY(-50%)";
  }
}
