module.exports = {
    getDateTime() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        const dezena = (num) => num < 10 ? `0${num}` : num

        return `${year}-${dezena(month)}-${dezena(day)} ${dezena(hours)}:${dezena(minutes)}:${dezena(seconds)}`;
    }
}