"""create table herbaty

Revision ID: 7252645ab138
Revises: 
Create Date: 2025-12-01 19:10:52.175160

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision = "0001_create_herbaty_table"
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        "herbaty",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("nazwa", sa.String, nullable=False),
        sa.Column("cena", sa.Float, nullable=False),
        sa.Column("dostepne", sa.Boolean, default=True),
    )

def downgrade() -> None:
    op.drop_table("herbaty")
