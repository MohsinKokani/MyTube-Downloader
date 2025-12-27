
const TabularOutput = ({ output }) => {
    function getType(mimeType) {
        return mimeType.substr(0, mimeType.indexOf(';'));
    }
    function getInMB(num) {
        let size = parseInt(num);
        return (size / 1048576).toFixed(2);
    }
    
    function getFileSize(element) {
        // If contentLength is available, use it
        if (element.contentLength) {
            return getInMB(element.contentLength) + 'MB';
        }
        
        // Try to estimate size using averageBitrate and duration
        if (element.averageBitrate && element.approxDurationMs) {
            // Formula: (bitrate in bits/sec * duration in seconds) / 8 / 1024 / 1024
            const durationInSeconds = parseInt(element.approxDurationMs) / 1000;
            const bitrate = parseInt(element.averageBitrate);
            const estimatedBytes = (bitrate * durationInSeconds) / 8;
            const estimatedMB = (estimatedBytes / 1048576).toFixed(2);
            return `~${estimatedMB}MB`;
        }
        
        // Try using bitrate and duration as fallback
        if (element.bitrate && element.approxDurationMs) {
            const durationInSeconds = parseInt(element.approxDurationMs) / 1000;
            const bitrate = parseInt(element.bitrate);
            const estimatedBytes = (bitrate * durationInSeconds) / 8;
            const estimatedMB = (estimatedBytes / 1048576).toFixed(2);
            return `~${estimatedMB}MB`;
        }
        
        return 'N/A';
    }
    
    function hasAudio(element) {
        // If it's an audio-only format, it has audio (so default return true)
        if (element.mimeType && element.mimeType.startsWith('audio/')) {
            return true;
        }
        
        // Check if it's a video format with audio
        if (element.mimeType && element.mimeType.startsWith('video/')) {
            // Check if it has audio properties
            if (element.audioQuality || element.audioSampleRate || element.audioChannels) {
                return true;
            }
            
            // Check if codecs string contains audio codecs
            const codecsMatch = element.mimeType.match(/codecs="([^"]+)"/);
            if (codecsMatch) {
                const codecs = codecsMatch[1].toLowerCase();
                // Common audio codecs: mp4a, opus, vorbis, aac
                if (codecs.includes('mp4a') || codecs.includes('opus') || 
                    codecs.includes('vorbis') || codecs.includes('aac')) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    return (
        <table className="tableContainer">
            <tbody>
                <tr>
                    <th>Format</th>
                    <th>Size</th>
                    <th>Download</th>
                </tr>
                {
                    output.map((element, idx) => {
                        const isVideoFormat = element.mimeType && element.mimeType.startsWith('video/');
                        const hasAudioTrack = hasAudio(element);
                        const showNoAudioIcon = isVideoFormat && !hasAudioTrack;
                        const showAudioIcon = isVideoFormat && hasAudioTrack;
                        
                        return (
                            <tr key={idx}>
                                <td>
                                    {getType(element.mimeType)} {element.qualityLabel}
                                    {showAudioIcon && (
                                        <i className="fa fa-volume-up" 
                                           style={{ marginLeft: '8px', color: '#4CAF50' }} 
                                           title="Has audio"></i>
                                    )}
                                    {showNoAudioIcon && (
                                        <i className="fa fa-volume-off" 
                                           style={{ marginLeft: '8px', color: '#999' }} 
                                           title="No audio"></i>
                                    )}
                                </td>
                                <td>{getFileSize(element)}</td>
                                <td>
                                    <a className="btn" href={element.url} target="_blank" rel='noreferrer'>
                                        <i className="fa fa-download"></i>
                                        Download
                                    </a>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
export default TabularOutput;