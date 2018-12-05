export const showLoader = (background = true) => ({
    type: 'SHOW_LOADER',
    visible: true,
    showBackground: background
});

export const hideLoader = () => ({
    type: 'HIDE_LOADER',
    visible: false,
    showBackground: true
});