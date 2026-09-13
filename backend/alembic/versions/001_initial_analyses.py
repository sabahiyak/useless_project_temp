"""Create analyses table

Revision ID: 001_initial_analyses
Revises: 
Create Date: 2026-09-13 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_analyses'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'analyses',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('image_path', sa.String(length=512), nullable=True),
        sa.Column('estimated_count', sa.Integer(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('algorithm_version', sa.String(length=50), nullable=False),
        sa.Column('processing_time_ms', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_analyses_status'), 'analyses', ['status'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_analyses_status'), table_name='analyses')
    op.drop_table('analyses')
