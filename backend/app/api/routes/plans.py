from typing import List

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.plan import (
    NativeSpecies,
    VolunteerPlanRequest,
    VolunteerPlanResponse,
)
from app.services.recommender import (
    InvalidSpeciesSelectionError,
    SiteNotFoundError,
    calculate_volunteer_plan,
    get_recommendations,
)

router = APIRouter(tags=["plans"])


@router.get(
    "/recommendations",
    response_model=List[NativeSpecies],
    status_code=status.HTTP_200_OK,
)
def recommend_species(
    site_id: str = Query(..., min_length=1, description="Verified São Paulo site_id"),
) -> List[NativeSpecies]:
    try:
        return get_recommendations(site_id)
    except SiteNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.post(
    "/volunteer-plan",
    response_model=VolunteerPlanResponse,
    status_code=status.HTTP_200_OK,
)
def create_volunteer_plan(payload: VolunteerPlanRequest) -> VolunteerPlanResponse:
    try:
        return calculate_volunteer_plan(payload)
    except SiteNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc
    except InvalidSpeciesSelectionError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
