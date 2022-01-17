export const capitalize = (string) => {
    if(!string) return
    const str = string.trim().toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1)
};
