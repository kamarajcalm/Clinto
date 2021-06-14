import { combineReducers } from 'redux';
import { selectTheme } from '../actions';


const selectedThemeReducer = (selectedTheme = null, action) => {
    if (action.type === "THEME_SELECTED") {
        return action.payload;
    }
    return selectedTheme
}
const selectedUserReducer = (selectedUser = null, action) => {
    if (action.type === "USER_SELECTED") {
        return action.payload;
    }
    return selectedUser
}
const selectedClinicReducer = (selectedClinic= null, action) => {
    if (action.type === "CLINIC_SELECTED") {
        return action.payload;
    }
    return selectedClinic
}
const selectedMedicalReducer = (selectedMedical = null, action) => {
    if (action.type === "MEDICAL_SELECTED") {
        return action.payload;
    }
    return selectedMedical
}
const selectedWorkingClinicsReducer = (selectedWorkingClinics = [], action) => {
    if (action.type === "WORKINGCLINICS_SELECTED") {
        return action.payload;
    }
    return selectedWorkingClinics
}
const selectedOwnedClinicsReducer = (selectedOwnedClinics = [], action) => {
    if (action.type === "OWNEDCLINICS_SELECTED") {
        return action.payload;
    }
    return selectedOwnedClinics
}
export default combineReducers({
    selectedTheme:selectedThemeReducer,
    selectedUser:selectedUserReducer,
    selectedClinic:selectedClinicReducer,
    selectedMedical:selectedMedicalReducer,
    selectedWorkingClinics: selectedWorkingClinicsReducer,
    selectedOwnedClinics: selectedOwnedClinicsReducer,
})