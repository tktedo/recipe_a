from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from ..database import get_db
from ..models import Memo, User
from ..schemas import MemoCreate, MemoUpdate, MemoResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/memos", tags=["memos"])


@router.get("/", response_model=List[MemoResponse])
def list_memos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Memo).filter(Memo.user_id == current_user.id).order_by(desc(Memo.updated_at)).offset(skip).limit(limit).all()


@router.post("/", response_model=MemoResponse, status_code=status.HTTP_201_CREATED)
def create_memo(memo: MemoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_memo = Memo(**memo.model_dump(), user_id=current_user.id)
    db.add(db_memo)
    db.commit()
    db.refresh(db_memo)
    return db_memo


@router.get("/{memo_id}", response_model=MemoResponse)
def get_memo(memo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    memo = db.query(Memo).filter(Memo.id == memo_id, Memo.user_id == current_user.id).first()
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found")
    return memo


@router.put("/{memo_id}", response_model=MemoResponse)
def update_memo(memo_id: int, memo_update: MemoUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    memo = db.query(Memo).filter(Memo.id == memo_id, Memo.user_id == current_user.id).first()
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found")
    update_data = memo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(memo, key, value)
    db.commit()
    db.refresh(memo)
    return memo


@router.delete("/{memo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memo(memo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    memo = db.query(Memo).filter(Memo.id == memo_id, Memo.user_id == current_user.id).first()
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found")
    db.delete(memo)
    db.commit()
