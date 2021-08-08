// export const isAuthenticated = () => localStorage.getItem('user_session') !== null;

export function isAuthenticated() {
     
    if (localStorage.getItem('user_session')) {
        
        return true
    } else {
        
        return false
    }
}