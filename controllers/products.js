const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({price: {$gte: 30}}).sort('price').select('name price').limit(0).skip(0)
    res.status(200).json({ success: true, products: { products, nbHits: products.length } })
}

const getAllProducts = async (req, res) => {
    // console.log(req.query);
    // search feature
    const {feature, company, name, sort, feilds, numericFilter} = req.query
    const queryObj = {}

    if(feature){
        queryObj.feature = feature === 'true' ? true : false
    }

    if(company){
        queryObj.company = company
    }
    if(name){
       // queryObj.name = name
         queryObj.name = {$regex: name, $options: 'i'}
    }

    // numeric filter

    if(numericFilter){
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': '$eq'
        }
        const regEx = /\b(<|>|>=|<=|=)\b/g

        let filters = numericFilter.replace(regEx, (match) => `-${operatorMap[match]}-`)

        const options = ['price', 'ratings']

        filters = filters.split(',').forEach((item) => {   
            const [feild, operator, value] = item.split('-')

            if(options.includes(feild)){
                queryObj[feild] = {[operator]: Number(value)}
            }
        })

    }


    let result = Product.find(queryObj)

    // sorting feature

    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else {
        result = result.sort('createdAt')
    }

    // select particular feild

    if(feilds){
        const feildList = feilds.split(',').join(' ')
        result = result.select(feildList)
    }

    // pagination

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    result = result.skip(skip).limit(limit)

    const products = await result

    res.status(200).json({ success: true, products: {products, nbHits: products.length} })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}