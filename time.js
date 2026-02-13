document.addEventListener("DOMContentLoaded", () => {
    const timeDisplay = document.getElementById("time-display");
    if (!timeDisplay) {
        return;
    }

    const updateTime = () => {
        const now = new Date();
        const spainTime = now.toLocaleString("en-US", {
            timeZone: "Europe/Madrid",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        
        const utcOffset = now.toLocaleString("en-US", {
            timeZone: "Europe/Madrid",
            timeZoneName: "shortOffset",
        }).split(" ").pop();
        
        timeDisplay.textContent = `${spainTime} ${utcOffset}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
});
