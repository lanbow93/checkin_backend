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
<!-- Index ~ /items(GET) | New ~ /items/new(POST) | Destroy ~ /items/:id(DELETE) | Update ~ /items/:id(PUT) | Edit ~ /items/:id/edit(GET) | Show ~ /items/:id(GET) -->
|Path | Suffix | Type | Description | Headers | 
| ----------- | ----------- | ----------- | ----------- |  ----------- |
|  |  |  |  |  |
| /user | /signup | POST | User Sign Up | N/A |
| /user | /login | POST | Sign In ~(SendsWebToken)~ | N/A |
| /user | /forgotpassword/:id | PUT | Update Password ~(forgotten)~ |  expiryToken |
| /user | /emailupdate/:id | PUT | Update Email | userToken ~(IncludePassword)~ |
| /user | /passwordupdate/:id | PUT | Update Password ~(UserPrompted)~ | userToken ~(IncludePassword)~ |
| /user | /logout | POST | Clears Web Token | N/A  |
| /user | /delete/:id | POST | Delete User Account | userToken ~(isSiteAdmin)~ |
|  |  |  |  |  |
| /qrcode | /create | POST | New QR Validation Created | userToken ~(AdminOfGroup)~  |
| /qrcode | /generate/:id | GET | Random string provided for QR ~(/qrcode/update/:id)~ |  userToken ~(AdminOfGroup)~|
| /qrcode | /update/:id | PUT | Updates String && Expiry Time  ~(InternalRequest)~|  userToken ~(SpecificOwner)~ |
| /qrcode | /verify | POST | Checks accessCode ~(/schedule/statusverified)~ |  userToken |
| /qrcode | /delete/:id | DELETE | Deletes QR document  |  userToken ~(SpecificOwner)~ |
|  |  |  |  |  |
| /group | /view | GET |  View Group Details |  userToken ~(isGroupAdmin)~ |
| /group | /create | POST |  Creates New Group  |  userToken ~(isGroupAdmin)~ |
| /group | /editmembers | PUT | Add/Remove Member To Group ~(/useraccount/{ADD-DELETE}/:id)~  |  userToken ~(isGroupAdmin)~ |
| /group | /editadmins | PUT | Add/Remove Member To Admin Group ~(/useraccount/{ADD-DELETE}admin/:id)~  |  userToken ~(isGroupAdmin)~ |
| /group | /delete/:id | DELETE | Deletes group |  userToken ~(isGroupAdmin)~ |
|  |  |  |  |  |
| /useraccount | /new | POST | Creates a new user |  N/A |
| /useraccount | /edit/:id | GET | Sends Info To Update ~(UserRequest)~ |  userToken |
| /useraccount | /updatedetails/:id | PUT | Update Account Details ~(UserRequest)~ |  userToken |
| /useraccount | /task/:id | PUT | Update Task |  userToken ~{AdminOfGroup} |
| /useraccount | /addgroup/:id | PUT | Add User To Group ~(InternalRequest)~ | N/A |
| /useraccount | /removegroup/:id | PUT | Remove User From Group ~(InternalRequest)~ | N/A |
| /useraccount | /addgroupadmin/:id | PUT | Add User To Admin Group ~(InternalRequest)~ | N/A |
| /useraccount | /removegroupadmin/:id | PUT | Remove User From Admin Group ~(InternalRequest)~ | N/A |
|  |  |  |  |  |
| /schedule | /new | POST | Creates Blank Schedule For User ~(InternalRequest)~ |  N/A |
| /schedule | /addschedule | PUT | Adds New Dates To Schedule |  userToken ~(AdminOfGroup)~ |
| /schedule | /:id | GET | View Schedule |  userToken ~(ScheduleAdminGroup-AdminOfGroup-SpecifiedUser)~ |
| /schedule | /edit/:id | GET | View Schedule To Edit |  userToken ~(ScheduleAdminGroup)~ |
| /schedule | /update/:id | POST | Edit Schedule |  userToken ~(ScheduleAdminGroup)~ |
| /schedule | /statusverifiedin | PUT | Adds Punch In/Out ~(InternalRequest)~  |  N/A |

