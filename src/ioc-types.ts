const TYPES = {
  TagsController: Symbol.for('TagsController'),
  TagsService: Symbol.for('TagsService'),
  TagsRepository: Symbol.for('TagsRepository'),

  CocktailsController: Symbol.for('CocktailsController'),
  CocktailsService: Symbol.for('CocktailsService'),
  CocktailsRepository: Symbol.for('CocktailsRepository'),

  ReviewsController: Symbol.for('ReviewsController'),
  ReviewsService: Symbol.for('ReviewsService'),
  ReviewsRepository: Symbol.for('ReviewsRepository'),

  IngredientsController: Symbol.for('IngredientsController'),
  IngredientsService: Symbol.for('IngredientsService'),
  IngredientsRepository: Symbol.for('IngredientsRepository')
}
export { TYPES }
