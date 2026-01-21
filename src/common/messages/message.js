import { get } from "http";

const generateMessageKeys = (entity) => ({
    notFound: `${entity}.notFound`,
    alreadyExist: `${entity}.alreadyExist`,
    failToCreate: `${entity}.failToCreate`,
    failToUpdate: `${entity}.failToUpdate`,
    createdSuccessfully: `${entity}.createdSuccessfully`,
    updatedSuccessfully: `${entity}.updatedSuccessfully`,
    getAll: `${entity}.getAll`,
    getSpecific: `${entity}.getSpecific`,
    changedPasswordSuccessfully: `${entity}.changedPasswordSuccessfully`,
    changedEmailSuccessfully: `${entity}.changedEmailSuccessfully`,
    deletedSuccessfully: `${entity}.deletedSuccessfully`,
    invalid: `${entity}.invalid`,
});

export const messages = {
    user: {
        ...generateMessageKeys("user"),
        phone: "user.phone",
        email: "user.email",
        notConfirmed: "user.notConfirmed",
        alreadyVerified: "user.alreadyVerified",
        verifiedSuccessfully: "user.verifiedSuccessfully",
        invaledLogin: "user.invaledLogin",
        invaledDeviceId: "user.invaledDeviceId",
        login: "user.login",
        signupSuccess: "user.signupSuccess",
        setPasswordSuccessfully: "user.setPasswordSuccessfully",
        invalidcrendential: "user.invalidcrendential",
        verfiedSuccessfully: "user.verfiedSuccessfully",
        profileFetchSuccessfully: "user.profileFetchSuccessfully"
    },
    image: {
        uploaded: "image.uploaded",
        invalidImage: "image.invalidImage",
        notFoundImage: "image.notFoundImage"
    },
    OTP: {
        haveOTP: "OTP.haveOTP",
        expiredOTP: "OTP.expiredOTP",
        OTPSent: "OTP.OTPSent",
        invalidOTP: "OTP.invalidOTP"
    },
    token: {
        invalid: "token.invalid",
        unauthenticate: "token.unauthenticate",
        unauthorized: "token.unauthorized",
        refreshToken: "token.refreshToken"
    },
    banner: {
        ...generateMessageKeys("banner"),
        requiredBanner: "banner.requiredBanner"
    },
    course: {
        ...generateMessageKeys('course'),
        searchNameRequired: "course.searchNameRequired",
        getAllPayed: "course.getAllPayed",
        joinCourseSuccessfully: "course.joinSuccessfully",
        shouldBeInstructor: "course.shouldBeInstructor",
        studentAlreadyJoined: "course.studentAlreadyJoined",
        userNotEnrolled: "course.userNotEnrolled",
        freeVideoRequired: "course.freeVideoRequired",
        videoNotFound: "course.videoNotFound",
        materialNotFound: "course.materialNotFound",
        freeVideoNotFound: "course.freeVideoNotFound",
        cannotDeleteActiveCourse: "course.cannotDeleteActiveCourse",
        joinSuccessfully: "course.joinSuccessfully",
        notWatchedAllVideos: "course.notWatchedAllVideos",
        notPaied: "course.notPaied",
        section: {
            videoRequired: "course.section.videoRequired",
            studentAlreadyJoined: "course.section.studentAlreadyJoined",
            updatedSuccessfully: "course.section.updatedSuccessfully",
            joinSectionSuccessfully: "course.section.joinSuccessfully",
            notFound: "course.section.notFound",
            getAll: "course.section.getAll",
            getSpecific: "course.section.getSpecific",
            notPaied: "course.section.notPaied",
            questionAddedSuccessfully: "course.section.questionAddedSuccessfully"
        },
        certificate: {
            ...generateMessageKeys('course.certificate'),
            fileRequired: "course.certificate.fileRequired",
            cannotUpdateAfterStudentsJoined: "course.certificate.cannotUpdateAfterStudentsJoined",
            userNotHaveCertificates: "course.certificate.userNotHaveCertificates",
            userNotHaveCertificate: "course.certificate.userNotHaveCertificate"
        }
    },
    instructor: {
        haveNotSalaryAccount: "instructor.haveNotSalaryAccount",
        getSalary: "instructor.getSalary",
        getAllInstructors: "instructor.getAllInstructors",
        salaryCannotBeNegative: "instructor.salaryCannotBeNegative"
    },
    university:{
        faculty:{
            specialization: {
                ...generateMessageKeys("university.faculty.specialization"),
            },
            ...generateMessageKeys("university.faculty"),
        },
        ...generateMessageKeys("university"),
    },
    notAuthorized: "general.notAuthorized",
    internalServicerError: "general.internalServicerError"
};