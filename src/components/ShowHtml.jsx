import parse from 'html-react-parser'
import { Table } from 'react-bootstrap'
const ShowHtml = ({ htmlText }) => {

    const changeHtmlData = () => {
        // First remove unnecessary p tags if the text is wrapped in them
        const cleanText = htmlText.replace(/^<p>(.*)<\/p>$/, '$1');
        
        return parse(cleanText, {
            replace: node => {
                if (node.name === 'table') {
                    node.attribs.class += ' table table-bordered table-hover table-striped';
                    return node;
                }
                // Remove empty p tags
                if (node.name === 'p' && (!node.children || node.children.length === 0)) {
                    return null;
                }
                return node;
            }
        });
    }

    return (
        <div>
            {changeHtmlData(htmlText)}
        </div>
    )
}

export default ShowHtml