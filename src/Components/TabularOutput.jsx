
const TabularOutput = ({ output }) => {
    function getType(mimeType) {
        return mimeType.substr(0, mimeType.indexOf(';'));
    }
    function getInMB(num) {
        let size = parseInt(num);
        return (size / 1048576).toFixed(2);
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
                        return (
                            <tr key={idx}>
                                <td>{getType(element.mimeType)} {element.qualityLabel}</td>
                                <td>{getInMB(element.contentLength)}MB</td>
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