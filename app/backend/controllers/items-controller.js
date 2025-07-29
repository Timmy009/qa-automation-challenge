const Item = require("../models/item")


exports.getItems = async (req, res, next) => {
  try {
    const items = await Item.find({ user: req.user.id })
    res.json(items)
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}

exports.createItem = async (req, res, next) => {
  const { name, description, quantity, price } = req.body

  const nameValidation = validateItemName(name)
  const descriptionValidation = validateItemDescription(description)
  const quantityValidation = validateItemQuantity(quantity.toString())
  const priceValidation = validateItemPrice(price.toString())

  if (!nameValidation.isValid) return res.status(400).json({ message: nameValidation.message })
  if (!descriptionValidation.isValid) return res.status(400).json({ message: descriptionValidation.message })
  if (!quantityValidation.isValid) return res.status(400).json({ message: quantityValidation.message })
  if (!priceValidation.isValid) return res.status(400).json({ message: priceValidation.message })

  try {
    const newItem = new Item({
      user: req.user.id,
      name,
      description,
      quantity,
      price,
    })

    const item = await newItem.save()
    res.status(201).json(item)
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}

exports.updateItem = async (req, res, next) => {
  const { name, description, quantity, price } = req.body

  const nameValidation = validateItemName(name)
  const descriptionValidation = validateItemDescription(description)
  const quantityValidation = validateItemQuantity(quantity.toString())
  const priceValidation = validateItemPrice(price.toString())

  if (!nameValidation.isValid) return res.status(400).json({ message: nameValidation.message })
  if (!descriptionValidation.isValid) return res.status(400).json({ message: descriptionValidation.message })
  if (!quantityValidation.isValid) return res.status(400).json({ message: quantityValidation.message })
  if (!priceValidation.isValid) return res.status(400).json({ message: priceValidation.message })

  try {
    let item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Ensure user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    item = await Item.findByIdAndUpdate(req.params.id, { $set: { name, description, quantity, price } }, { new: true })

    res.json(item)
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Ensure user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await Item.findByIdAndDelete(req.params.id)

    res.json({ message: "Item removed" })
  } catch (err) {
    console.error(err.message)
    next(err)
  }
}
