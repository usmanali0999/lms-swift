// Enterprise Time Management Utility - Enforcing Strict UTC Rules

const getCurrentUtcTimestamp = () => {
    return new Date().toISOString(); // Always returns ISO-8601 in UTC (Z format)
};

const formatToUserTimezone = (utcDateString, timeZone = 'Asia/Karachi') => {
    try {
        const date = new Date(utcDateString);
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            dateStyle: 'full',
            timeStyle: 'long'
        }).format(date);
    } catch (error) {
        return utcDateString; // Fallback if timezone string is invalid
    }
};

module.exports = {
    getCurrentUtcTimestamp,
    formatToUserTimezone
};