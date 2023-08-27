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
    * Send Grid/mail
    * Crypto
* Models
    * QRCode
        * **accessCode** - String
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
        * **admins** - Array[userAccount _id]
        * **members** - Array[userAccount _id]
        * **_id** - Mongo generated string
    * UserAccount
        * **name** - String *Unique*
        * **badgeName** - String *Unique*
        * **email** - String *Unique*
        * **groupNames** - Array[Strings]
        * **currentTask** - Array[task, badgeNameOfGroupAdmin]
        * **adminOf** - Array[groupNames]
        * **isSiteAdmin** - boolean
        * **isGroupAdmin** - boolean
        * **isScheduleAdmin** - boolean
        * **accountID** - string <sub>(Mongo user _id)</sub>
        * **_id** - Mongo generated string
    * Schedules
        * **user** - UserAccount _id
        * **group** - group _id
        * **assignedClockIn** - Array[Date]
        * **assignedClockOut** - Array[Date]
        * **userPunchIn** - Array[Array[Date **,** QR Badge Name]]
        * **userPunchOut** - Array[Array[Date **,** QR Badge Name]]
        * **_id** - Mongo generated string

##Routes
<!-- Index <sub> /items(GET) | New <sub> /items/new(POST) | Destroy <sub> /items/:id(DELETE) | Update <sub> /items/:id(PUT) | Edit <sub> /items/:id/edit(GET) | Show <sub> /items/:id(GET) -->
|Path | Suffix | Type | Description | Headers | 
| ----------- | ----------- | ----------- | ----------- |  ----------- |
|  |  |  |  |  |
| /user | /signup | POST | User Sign Up <sub>(Also Creates New UserAccount)</sub> | N/A |
| /user | /login | POST | Sign In <sub>(Sends Web Token)</sub> | N/A |
| /user | /forgotpassword | PUT | Generate Email For Password Reset / Update Expiry String <sub>(Forgotten)</sub> | <sub>(Include Valid Email)</sub> |
| /user | /forgotpassword/:id | PUT | Update Password <sub>(Forgotten)</sub> |  <sub>5 Minute Timer</sub> |
| /user | /emailupdate/:id | PUT | Update Email | userToken <sub>(Include Password)</sub> |
| /user | /passwordupdate/:id | PUT | Update Password <sub>(User Prompted)</sub> | userToken <sub>(Include Password)</sub> |
| /user | /logout | POST | Clears Web Token | N/A  |
| /user | /delete/:id | POST | Delete User Account | userToken <sub>(isSiteAdmin)</sub> |
|  |  |  |  |  |
| /qrcode | /new | POST | New QR Validation Created | userToken <sub>(Admin Of Group)</sub>  |
| /qrcode | /generate/:id | GET | Random string provided for QR <sub>(/qrcode/update/:id)</sub> |  userToken <sub>(Admin Of Group)</sub>|
| /qrcode | /update/:id | PUT | Updates String && Expiry Time  <sub>(Internal Request)</sub>|  userToken <sub>(Specific Owner)</sub> |
| /qrcode | /verify | POST | Checks accessCode <sub>(/schedule/statusverified)</sub> |  userToken |
| /qrcode | /delete/:id | DELETE | Deletes QR document  |  userToken <sub>(Specific Owner)</sub> |
|  |  |  |  |  |
| /group | /view | GET |  View Group Details |  userToken <sub>(isGroupAdmin)</sub> |
| /group | /new | POST |  Creates New Group  |  userToken <sub>(isGroupAdmin)</sub> |
| /group | /editmembers | PUT | Add/Remove Member To Group <sub>(/useraccount/{ADD-DELETE}/:id)</sub>  |  userToken <sub>(isGroupAdmin)</sub> |
| /group | /editadmins | PUT | Add/Remove Member To Admin Group <sub>(/useraccount/{ADD-DELETE}admin/:id)</sub>  |  userToken <sub>(isGroupAdmin)</sub> |
| /group | /delete/:id | DELETE | Deletes group |  userToken <sub>(isGroupAdmin)</sub> |
|  |  |  |  |  |
| /useraccount | /edit/:id | GET | Sends Info To Update <sub>(User Request)</sub> |  userToken |
| /useraccount | /updatedetails/:id | PUT | Update Account Details <sub>(User Request)</sub> |  userToken |
| /useraccount | /task/:id | PUT | Update Task |  userToken <sub>{Admin Of Group}</sub> |
| /useraccount | /addgroup/:id | PUT | Add User To Group <sub>(Internal Request)</sub> | N/A |
| /useraccount | /removegroup/:id | PUT | Remove User From Group <sub>(Internal Request)</sub> | N/A |
| /useraccount | /addgroupadmin/:id | PUT | Add User To Admin Group <sub>(Internal Request)</sub> | N/A |
| /useraccount | /removegroupadmin/:id | PUT | Remove User From Admin Group <sub>(Internal Request)</sub> | N/A |
|  |  |  |  |  |
| /schedule | /new | POST | Creates Blank Schedule For User <sub>(InternalRequest)</sub> |  N/A |
| /schedule | /addschedule | PUT | Adds New Dates To Schedule |  userToken <sub>(AdminOfGroup)</sub> |
| /schedule | /:id | GET | View Schedule |  userToken <sub>(ScheduleAdminGroup-AdminOfGroup-SpecifiedUser)<sub> |
| /schedule | /edit/:id | GET | View Schedule To Edit |  userToken <sub>(ScheduleAdminGroup)<sub> |
| /schedule | /update/:id | POST | Edit Schedule |  userToken <sub>(ScheduleAdminGroup)<sub> |
| /schedule | /statusverifiedin | PUT | Adds Punch In/Out <sub>(InternalRequest)<sub>  |  N/A |

