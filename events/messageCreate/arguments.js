// Send all the text after the command as an Array to "messageArgText" param
// commandArgs param should be sent the args Object that is sent during command registrating
async function argParser(bot, messageArgText, commandArgs) {
    var fields = Object.keys(commandArgs)
    var fieldValues = new Array(fields.length)
    hasMetCoalesc = false


    fields.forEach(currentItem => {
        if(currentItem === null) return
        let fieldVal = fields[currentItem]

        // If a coalescing string argument has met, it would mean all text thereafter would be part of this arg
        if(hasMetCoalesc){
            fieldValues.push(null)
        }else if(fieldVal === "StringCoalescing" || fields === "rStringCoalescing"){
            hasMetCoalesc = true
            // connect all remaining strings of the messageArgText array and assign that
            // for this to work elements of the messageArgText array should be removed after they are assigned for other args
        }else {
            // pattern match and parse
        }
    });

    return fieldValues;
}