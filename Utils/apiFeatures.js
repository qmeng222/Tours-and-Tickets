class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // filtering:
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // advanced filtering:
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
    // NOTE: equal to this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // sorting (eg, Get All Tours: http://127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage (price: des, ratingsAverage: asc)):
  sort() {
    if (this.queryString.sort) {
      // console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(' '); // ['-price', 'ratingsAverage'] --> '-price ratingsAverage'
      this.query.sort(sortBy); // eg: query.sort('-price ratingsAverage'); same as query = query.sort(sortBy)
    } else {
      this.query.sort('-ratingsAverage');
    }
    return this;
  }

  // field limiting (eg, Get All Tours: http://127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price):
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v'); // '-' means excludes, a.k.a only includes the other fields in the response
    }
    return this;
  }

  // pagination:
  paginate() {
    const page = this.queryString.page * 1 || 1; // str --> num
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIfeatures;
