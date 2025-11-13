const generateMessage = (entity) => ({
    notFound: `${entity} not found`,
    alreadyExist: `${entity} already exist`,
    failToCreate: `fail to create ${entity}`,
    failToUpdate: `fail to update ${entity}`,
    createdSuccessfully: `${entity} created Successfully`,
    updatedSuccessfully: `${entity} updated Successfully`,
    changedPasswordSuccessfully: `${entity} password changed Successfully, please login`,
    changedEmailSuccessfully: `${entity} email changed Successfully, please check your email to verify`,
    deletedSuccessfully: `${entity} deleted Successfully`,
    invalid: `${entity} invalid`
})

export const messages = {
    user: {
        ...generateMessage('user'),
        phone: "phone already exist",
        username: "username already exist",
        email: "email already exist",
        notConfirmed: " please confirm your email first",
        alreadyVerified: "account is alreadyverified",
        verifiedSuccessfully: "account verified successfully",
        login: "login successfully",
        signupSuccess:"signup successfully.",
        setPasswordSuccessfully:"Password entered successfully, Please login.",
        invalidcrendential: "invalid credential",
        friend: {
            alreadyInFriendList: "you are in friend list",
            alreadySentFriendRequest: "you are already sent friend request",
            alreadyReceivedFriendRequest: "you are already received friend request",
            addedFriendRequest: "friend requested successfulyy",
            emptyFriend: "friend was empty",
            emptyFriendRequest: "friend request was empty",
            emptySentFriendRequest: "sent friend request was empty",
            
        }
    },
    image:{
        coverUploaded:  "cover images uploaded successfully",
        invalidImage: "invalid image",
        notFoundImage: "you don't have any image"
    },
    OTP:{
        haveOTP: "you already have OTP",
        expiredOTP:"OTP has been expired",
        OTPSent: "check your email",
        invalidOTP: "invalid OTP"
    },
    token: {
        invalid: "invalid bearer token",
        unauthenticate: "unauthenticate"
    },
    post:{
        ...generateMessage("post"),
        notAuthorized: "You are not authorized to do this.",
        archive: "post archived successfully",
        restore: "post restored successfully"
    },
    comment:{
      ...generateMessage("comment")  
    },
    internalServicerError: "please try again later"
}