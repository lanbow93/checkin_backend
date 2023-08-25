
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
    isSiteAdmin: boolean,
    isGroupAdmin: boolean,
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
