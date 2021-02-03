# Wagtail API for Node.js
If you want to use a wagtail api endpoint in javascript this little module will help.

```
import api from 'wagtail-api';

// to fetch the content of a specific page 
var pageContent = await api.pages.$get(3);

// to fetch the content of a page based on the slug
var pageContent = await api.pages.$path("/about-us");

```

## Find pages by slug:
In order to find pages based on the slug (and not the id) add this into your `mysite/api.py` file:
```
class CustomPagesAPIViewSet(PagesAPIViewSet):
 model = Page
 filter_backends = PagesAPIViewSet.filter_backends + [
  AbsolutePathFilter,
  RealEstateFilter,
  Scheduler,
 ]
 known_query_parameters = PagesAPIViewSet.known_query_parameters.union([
  'absolute_path',
  'region',
  'price',
  'area',
  'property',
  'rooms',
  'baths',
  'available',
 ])
 body_fields = PagesAPIViewSet.body_fields + [
  'title',
  'url',
 ]
 listing_default_fields = PagesAPIViewSet.listing_default_fields + [
  'title',
  'url',
 ]
 detail_only_fields = []

 def detail_view(self, request, pk=None, slug=None):
  param = pk
  if slug is not None:
   self.lookup_field = 'slug'
   param = slug
  try:
   return super().detail_view(request, param)
  except MultipleObjectsReturned:
   # Redirect to the listing view, filtered by the relevant slug
   # The router is registered with the `wagtailapi` namespace,
   # `pages` is our endpoint namespace and `listing` is the listing view url name.
   return redirect(
    reverse('wagtailapi:pages:listing') + f'?{self.lookup_field}={param}'
   )

```