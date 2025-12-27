
const VideoDetails = ({imgPath, videoTitle, lengthSeconds, viewCount}) => {
    // Format seconds to HH:MM:SS
    function formatDuration(seconds) {
        if (!seconds) return '00:00';
        
        const sec = parseInt(seconds);
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const secs = sec % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Format view count with commas
    function formatViews(views) {
        if (!views) return '0';
        return parseInt(views).toLocaleString();
    }
    
    return (
        <div className="videoDetails" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <img src={imgPath} alt="thumbnail" />
            <div style={{ flex: 1 }}>
                <div className="videoTitle row-spaced">
                    {videoTitle}
                </div>
                {(lengthSeconds || viewCount) && (
                    <div className="videoMeta" style={{ 
                        display: 'flex', 
                        gap: '20px', 
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#fff'
                    }}>
                        {lengthSeconds && (
                            <span>
                                <i className="fa fa-clock-o" style={{ marginRight: '5px' }}></i>
                                {formatDuration(lengthSeconds)}
                            </span>
                        )}
                        {viewCount && (
                            <span>
                                <i className="fa fa-eye" style={{ marginRight: '5px' }}></i>
                                {formatViews(viewCount)} views
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default VideoDetails;