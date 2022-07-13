export const isToday = date => {
    const yesterday = new Date();
    return yesterday.toLocaleDateString() === date.toLocaleDateString();
};
