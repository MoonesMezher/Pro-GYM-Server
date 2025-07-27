const find = async (Model, filter, opts) => {
    let output;

    if(opts === "id") {
        output = await Model.findById(filter);        
    } else if(opts === "one") {
        output = await Model.findOne(filter);
    } else {
        output = await Model.find(filter);        
        output = output.length !== 0;
    }

    return output? output: false;
}

module.exports = find