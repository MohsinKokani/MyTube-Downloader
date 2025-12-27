
const TabularOutput = ({ output }) => {
    function getType(mimeType) {
        return mimeType.substr(0, mimeType.indexOf(';'));
    }
    function getInMB(num) {
        let size = parseInt(num);
        return (size / 1048576).toFixed(2);
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
                                <td>{ element.contentLength ? getInMB(element.contentLength) + 'MB' : 'N/A'}</td>
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