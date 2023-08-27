
// Models Interfaces

export interface IUser {
    username: string,
    password: string,
    email: string,
    resetToken: string,
    resetTokenExpiry: Date
}

export interface IUserAccount {
    name: string,
    badgeName: string,
    email: string,
    groupNames: Array<string>,
    currentTask: [task: string, badgeNameOfGroupAdmin: string],
    adminOf: Array<string>,
    accountID: string,
    isSiteAdmin: boolean,
    isGroupAdmin: boolean,
    isScheduleAdmin: boolean
}

export interface IGroup {
    groupName: string,
    admins: Array<string>,
    members: Array<string>,
}

export interface ISchedule {
    user: string,
    group: string,
    assignedClockIn: Array<Date>,
    assignedClockOut: Array<Date>,
    userPunchIn: Array<[currentDate: Date, QRBadgeName: string ]>,
    userPunchOut: Array<[currentDate: Date, QRBadgeName: string ]>,
}

export interface IQRCode {
    accessCode: string,
    expiryTime: Date,
    group: string,
    controllingAdmin: string,
}


// Types after returned from Mongo
export interface IUserObject extends IUser{
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

export interface IUserAccountObject extends IUserAccount{
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

export interface IQRCodeObject extends IQRCode{
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

export interface IScheduleObject extends ISchedule{
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

export interface IGroupObject extends IGroup{
    createdAt: Date,
    updatedAt: Date,
    _id: string
}