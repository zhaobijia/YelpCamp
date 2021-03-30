var uploadField = document.getElementById("image");
//2097152
uploadField.onchange = function () {
    for (img of this.files) {
        if (img.size > 2097152) {
            alert("Please upload image with size below 2MB");
            this.value = "";
        }
    }

};
