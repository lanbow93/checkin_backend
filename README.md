# Speedy Check In

An easy application to check in employees at a kiosk area and validate attendance

##Planning
* Technology
    * Typescript
    * ExpressJS
    * Javascript Web Token (JWT)
    * MongoDB
    * React
    * Node
* Models
    * QRCode
        * **expiryTime** - Date
        * **group** - group _id
        * **controllingAdmin** - UserAccount ID 
        * **_id** - Mongo generated string
    * User
        * **username** - String *Unique*
        * **password** - String (Hash and Salted)
        * **email** - String *Unique*
        * **resetToken** - String (Hash and Salted)
        * **resetTokenExpiry** - Date
        * **_id** - Mongo generated string
    * Group
        * **groupName** - String *Unique*
        * **members** - Array[UserAccount _id]
        * **_id** - Mongo generated string
    * UserAccount
        * **name** - String *Unique*
        * **badgeName** - String *Unique*
        * **groupNames** - Array[Strings]
        * **currentTask** - String
        * **adminOf** - Array[groupNames]
        * **_id** - Mongo generated string
    * Schedules
        * **user** - UserAccount _id
        * **group** - group _id
        * **assignedClockIn** - Array[Date, QRAdmin ]
        * **assignedClockOut** - Date
        * **userPunchIn** - Date
        * **userPunchOut** - Date
        * **_id** - Mongo generated string
##Routes
|Path | Suffix | Type | Description | Headers | 
| ----------- | ----------- | ----------- | ----------- |  ----------- |
| /user | /signup | POST | User Sign Up | N/A |
| /user | /login | POST | Sign In - Send Web Token | N/A
| /user | /update | POST | Update Password & Email |  ExpiryToken |
| /user | /logout | POST | Clears Web Token |   |
|  |  |  |  |  |
| /qrcode | /create | POST | New QR Validation Created | User Token of Group Admin  |
| /qrcode | /generate | POST | Random string provided for QR |  User Token of Group Admin|
 
        