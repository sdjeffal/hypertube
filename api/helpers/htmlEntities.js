function HtmlEntities (str)
{
    return decodeURI(decodeURIComponent(str).replace(/&amp;/g, '&'))
}

module.exports = HtmlEntities