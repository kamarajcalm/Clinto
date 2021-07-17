export const selectTheme = (theme) => {
    return {
        type: 'THEME_SELECTED',
        payload: theme
    }
}
export const selectUser = (user) => {
    return {
        type: 'USER_SELECTED',
        payload: user
    }
}
export const selectClinic = (clinic) => {
    return {
        type: 'CLINIC_SELECTED',
        payload: clinic
    }
}
export const selectMedical = (medical) => {
    return {
        type: 'MEDICAL_SELECTED',
        payload: medical
    }
}
export const selectWorkingClinics = (clinics) => {
    return {
        type: 'WORKINGCLINICS_SELECTED',
        payload: clinics
    }
}
export const selectOwnedClinics = (clinics) => {
    return {
        type: 'OWNEDCLINICS_SELECTED',
        payload: clinics
    }
}
export const setShowLottie = (value) => {
    return {
        type: 'LOTTIE_SELECTED',
        payload: value
    }
}
export const setNoticationRecieved = (value) => {
    return {
        type: 'NOTIFICATION_SELECTED',
        payload: value
    }
}
export const setFirstTime = (value) => {
    return {
        type: 'FIRST_SELECTED',
        payload: value
    }
}