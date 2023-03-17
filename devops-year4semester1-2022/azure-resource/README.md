# Terraform

https://acloudguru.com/blog/engineering/the-ultimate-terraform-cheatsheet <br>
คำสั่งที่ใช้บ่อย

```
terraform init   //ใช้ตอนแรกสุด
terraform init -reconfigure    //ใช้ตอนที่มีconfigใหม่ๆเพิ่มขึ้นมา
terraform plan     //ตรวจสอบการทำงาน
terraform apply
terraform destroy
```

<br>

# Variable

https://acloudguru.com/blog/engineering/the-ultimate-terraform-cheatsheet <br>
คำสั่งที่ใช้ร่วมกับ Variable Files ถ้าไม่ใส่มันจะไม่มี values นั้น ทำให้ตอนเรารันเราต้องกำหนด values เอง

```
terraform init   //ใช้ตอนแรกสุด
terraform init -reconfigure    //ใช้ตอนที่มีconfigใหม่ๆเพิ่มขึ้นมา
terraform plan -var-file="var.tfvars"   //ตรวจสอบการทำงาน
terraform apply -var-file="var.tfvars"
terraform destroy -var-file="var.tfvars"
```

https://www.terraform.io/language/configuration-0-11/variables <br>

### มีหลายวิธีในการทำ แต่อันนี้ใช้วิธีสร้าง Variable Files ขึ้นมา

ในไฟล์พวก main.tf จะมี Variable อยู่เรียกว่า **_Input variables_** ซึ่งจะรอรับค่าจาก values <br>

- สามารถใช้ variable ได้โดยใช้ `var.` หรือจะเขียนแบบนี้ได้ `"${var.rg_name}-cluster"`

ไฟล์ var.tfvars เป็น **_Values_** ที่ส่งค่าไปหา Input variables



░░░░░░░░░░░░░░░░░░░░░▄▀░░▌  <br>
░░░░░░░░░░░░░░░░░░░▄▀▐░░░▌  <br>
░░░░░░░░░░░░░░░░▄▀▀▒▐▒░░░▌  <br>
░░░░░▄▀▀▄░░░▄▄▀▀▒▒▒▒▌▒▒░░▌  <br>
░░░░▐▒░░░▀▄▀▒▒▒▒▒▒▒▒▒▒▒▒▒█   <br>
░░░░▌▒░░░░▒▀▄▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄   <br>
░░░░▐▒░░░░░▒▒▒▒▒▒▒▒▒▌▒▐▒▒▒▒▒▀▄   <br>
░░░░▌▀▄░░▒▒▒▒▒▒▒▒▐▒▒▒▌▒▌▒▄▄▒▒▐    <br>
░░░▌▌▒▒▀▒▒▒▒▒▒▒▒▒▒▐▒▒▒▒▒█▄█▌▒▒▌   <br>
░▄▀▒▐▒▒▒▒▒▒▒▒▒▒▒▄▀█▌▒▒▒▒▒▀▀▒▒▐░░░▄   <br>
▀▒▒▒▒▌▒▒▒▒▒▒▒▄▒▐███▌▄▒▒▒▒▒▒▒▄▀▀▀▀    <br>
▒▒▒▒▒▐▒▒▒▒▒▄▀▒▒▒▀▀▀▒▒▒▒▄█▀░░▒▌▀▀▄▄    <br>
▒▒▒▒▒▒█▒▄▄▀▒▒▒▒▒▒▒▒▒▒▒░░▐▒▀▄▀▄░░░░▀    <br>
▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▄▒▒▒▒▄▀▒▒▒▌░░▀▄      <br>
▒▒▒▒▒▒▒▒▀▄▒▒▒▒▒▒▒▒▀▀▀▀▒▒▒▄▀     <br>