from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.http import require_GET


@require_GET
def users_list(request):
    users = get_user_model().objects.all()
    search = request.GET.get('search', '').strip()
    email = request.GET.get('email', '').strip()

    if search:
        users = users.filter(username__icontains=search)
    if email:
        users = users.filter(email__icontains=email)

    return JsonResponse(
        list(users.values('id', 'username', 'email')),
        safe=False,
    )
