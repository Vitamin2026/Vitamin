module.exports = async (req, res) => {
    try {
        const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};
