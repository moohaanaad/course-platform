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
        login: "user.login",
        signupSuccess: "user.signupSuccess",
        setPasswordSuccessfully: "user.setPasswordSuccessfully",
        invalidcrendential: "user.invalidcrendential",
        verfiedSuccessfully: "user.verfiedSuccessfully",
    },
    image: {
        uploaded: "image.uploaded",
        invalidImage: "image.invalidImage",
        notFoundImage: "image.notFoundImage"
    },
    OTP: {
        haveOTP: "otp.haveOTP",
        expiredOTP: "otp.expiredOTP",
        OTPSent: "otp.OTPSent",
        invalidOTP: "otp.invalidOTP"
    },
    token: {
        invalid: "token.invalid",
        unauthenticate: "token.unauthenticate"
    },
    banner: {
        ...generateMessageKeys("banner"),
        requiredBanner: "banner.requiredBanner"
    },
    course: {
        ...generateMessageKeys('course'),
        getAllPayed:"course.getAllPayed",
        joinCourseSuccessfully: "course.joinSuccessfully",
        shouldBeInstructor: "course.shouldBeInstructor",
        studentAlreadyJoined: "course.studentAlreadyJoined",

        userNotEnrolled: "course.userNotEnrolled",
        freeVideoRequired: "course.freeVideoRequired",
        videoNotFound: "course.videoNotFound",
        freeVideoNotFound: "course.freeVideoNotFound",
        cannotDeleteActiveCourse: "course.cannotDeleteActiveCourse",
        joinSuccessfully: "course.joinSuccessfully",
        section: {
            videoRequired: "course.section.videoRequired",
            studentAlreadyJoined: "course.section.studentAlreadyJoined",
            updatedSuccessfully: "course.section.updatedSuccessfully",
            joinSectionSuccessfully: "course.section.joinSuccessfully",
            notFound: "course.section.section notFound", 
			getAll: "course.section.getAll",
			getSpecific: "course.section.getSpecific",
        },
        sertificate:{
            ...generateMessageKeys('sertificate'),
            fileRequired: "course.sertificate.fileRequired"
        }
    },
    notAuthorized: "general.notAuthorized",
    internalServicerError: "general.internalServicerError"
};