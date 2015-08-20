from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt

import datetime

from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader

from django.core.urlresolvers import reverse

from django.shortcuts import get_object_or_404, render, redirect

from .models import Family, Camper, Rate, EventYear, Attendance

import json

# def index(request):
#     return HttpResponse("Hello, world. You're at the polls index.")

# def login_needed(request):
#     template = loader.get_template('seabeck_draft/login_needed.html')
#     return render(template, 'seabeck_draft/login_needed.html', {})
#


def login_view(request):
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect("/")

    return render(request, 'seabeck_draft/login.html', {})


def register_view(request):

    if request.POST:
        user = User()
        user.username = request.POST['username']
        user.email = request.POST['username']
        user.set_password(request.POST['password'])
        user.first_name = request.POST['first_name']
        user.last_name = request.POST['last_name']
        user.save()

        family = Family()
        family.user = user
        family.phone = request.POST['phone']
        family.save()

        camper = Camper()
        camper.family = family
        camper.first_name = user.first_name
        camper.last_name = user.last_name
        camper.under_18 = False
        camper.dob = None
        camper.save()

        return HttpResponseRedirect("/login/")

    return render(request, 'seabeck_draft/register.html', {})


def logout_view(request):
    logout(request)
    return redirect("/logout_successful/")


# @login_required(login_url='/login_needed/')
# def index(request):
#     families_list = Family.objects.order_by("user__last_name")
# #often use two underscores to represent dot/fk relationship
#     template = loader.get_template('seabeck_draft/index.html')
#     context = RequestContext(request, {'families_list': families_list})
#
#     return HttpResponse(template.render(context))

@login_required(login_url='/login_needed/')
def index(request):
    family = get_object_or_404(Family, user=request.user)

    if request.POST:
        print(request.POST)
        family.user.first_name = request.POST["first_name"]
        family.user.last_name = request.POST["last_name"]
        family.user.email = request.POST["email"]
        family.phone = request.POST["phone"]

        family.street_address = request.POST["street_address"]
        family.apt_no = request.POST["apt_no"]
        family.city = request.POST["city"]
        family.state = request.POST["state"]
        family.zip_code = request.POST["zip_code"]

        family.ec_1_first = request.POST["ec_1_first"]
        family.ec_1_last = request.POST["ec_1_last"]
        family.ec_1_phone = request.POST["ec_1_phone"]
        family.ec_1_relation = request.POST["ec_1_relation"]

        family.ec_2_first = request.POST["ec_2_first"]
        family.ec_2_last = request.POST["ec_2_last"]
        family.ec_2_phone = request.POST["ec_2_phone"]
        family.ec_2_relation = request.POST["ec_2_relation"]

        family.save()
        return HttpResponseRedirect("/")

    return render(request, 'seabeck_draft/index.html', {'family': family})



@login_required(login_url='/login_needed/')
def detail(request):

    family = get_object_or_404(Family, user=request.user)
    return render(request, 'seabeck_draft/detail.html', {'family': family})

@login_required()
def dynamic_detail(request, family_id):
    # family = get_object_or_404(Family, pk=family_id)
    return render(request, 'seabeck_draft/dynamic_detail.html', {})


def api_campers(request):

    years = EventYear.objects.all()
    current_year = list(reversed(years))[0]
    campers = Camper.objects.filter(family__user=request.user)
    output = []
    print(current_year)
    for camper in campers:
        in_current_year = len(Attendance.objects.filter(camper=camper, event_year=current_year)) > 0

        output.append({
            "id": camper.id,
            "name": camper.first_name + " " + camper.last_name,
            "in_current_year": in_current_year,
            "under_18": camper.under_18,
            "is_vegetarian": camper.is_vegetarian,
            "is_vegan": camper.is_vegan,
            "is_gf": camper.is_gf,
            "is_df": camper.is_df,
            "dob": str(camper.dob)
        })

        if in_current_year and camper.under_18: # not sure about second condition
            output.append({
                "grade": Attendance.objects.filter(camper=camper, event_year=current_year).grade,
                "sponsor": Attendance.objects.filter(camper=camper, event_year=current_year).sponsor,
                # "sponsor_phone": Attendance.objects.filter(camper=camper, event_year=current_year).sponsor_phone
            })

    return HttpResponse(json.dumps(output, indent=4), content_type="application/json")


# def api_detail(request, family_id):
#         family = get_object_or_404(Family, pk=family_id)
#     return render(request, 'seabeck_draft/detail.html', {'family': family})
#

# @ensure_csrf_cookie
@csrf_exempt
def update_camper(request):
    if request.POST:
        print(request.POST)
        id = int(request.POST.get("id"))
        camper = get_object_or_404(Camper, id=id)

        if "dob" in request.POST:
            camper.dob = datetime.datetime.strptime(request.POST.get("dob"), "%Y-%m-%d")
        # if "last_name" in request.POST:
        #     user.last_name = request.POST.get("last_name")
        # if "bio" in request.POST:
        #     dancer.bio = request.POST.get("bio")

        if "is_vegetarian" in request.POST:
            print "is_vegetarian is in request.post!!!"
            camper.is_vegetarian = request.POST.get("is_vegetarian") == 'true'
        else:
            print "is_vegetarian is not in request.post :("

        camper.save()

    return HttpResponse(str(camper.id))


def login_needed(request):
    return render(request, 'seabeck_draft/login_needed.html')

def logout_successful(request):
    return render(request, 'seabeck_draft/logout_successful.html')

def edit_family(request, family_id):

    if family_id == 0:
        print "new"
        family = Family()
    else:
        print "existing"
        family = get_object_or_404(Family, pk=family_id)

    filtered_family_list = Family.objects.filter(id=family_id)

#    if len(filtered_family_list) > 0:
    family = filtered_family_list[0]
#    else:
#        family = Family()

    if request.POST:
        print(request.POST)
        family.first_name = request.POST["first_name"]
        family.last_name = request.POST["last_name"]
        family.email = request.POST["email"]
        family.phone = request.POST["phone"]
        family.save()
        return HttpResponseRedirect("/")

    return render(request, 'seabeck_draft/edit_family.html', {'family': family})


def new_family(request):

    family = Family()

    if request.POST:
        print(request.POST)
        family.first_name = request.POST["first_name"]
        family.user.last_name = request.POST["user.last_name"]
        family.email = request.POST["email"]
        family.phone = request.POST["phone"]
        family.save()
        return HttpResponseRedirect("/")

    return render(request, 'seabeck_draft/new_family.html', {'family': family})


def edit_camper(request, camper_id):

    if camper_id == "0":
        camper = Camper()
    else:
        camper = get_object_or_404(Camper, pk=camper_id)

    filtered_camper_list = Camper.objects.filter(id=camper_id)

    if len(filtered_camper_list) > 0:
        camper = filtered_camper_list[0]
    else:
        camper = Camper()

    if request.POST:
        print(request.POST)
        camper.first_name = request.POST["first_name"]
        camper.last_name = request.POST["last_name"]
        camper.under_18 = request.POST["under_18"]
        camper.save()
        return HttpResponseRedirect("/")

    return render(request, 'seabeck_draft/edit_camper.html', {'camper': camper})
