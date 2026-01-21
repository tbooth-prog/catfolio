import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ApiClient } from '~/service/apiClient';
import { countVotes, getOrCreateUserId } from '~/utils';
import type { MyVote, VoteImageRequest } from './types';
import type { DeleteFavourite } from '~/api/types';
import { getVotes } from '~/api/endpoints';
import { TaskStatus } from '~/utils/enums';

type VoteState = {
	// myVotes: Record<string, MyVote>;
	totalVotes: Record<string, number>;
	totalVoteStatus: TaskStatus;
};

const initialState: VoteState = {
	// myVotes: {},
	totalVotes: {},
	totalVoteStatus: TaskStatus.Idle,
};

const voteSlice = createSlice({
	name: 'vote',
	initialState,
	reducers: {
		addVote(state, action: PayloadAction<VoteImageRequest>) {
			const imageId = action.payload.imageId;
			const vote = action.payload.vote;
			// state.myVotes[imageId] = action.payload.vote;

			state.totalVotes[imageId] = (state.totalVotes[imageId] || 0) + (vote.value || 0);
		},
		bulkAddVotes(state, action: PayloadAction<VoteImageRequest[]>) {
			action.payload.forEach((voteReq) => {
				// state.myVotes[voteReq.imageId] = voteReq.vote;
				state.totalVotes[voteReq.imageId] = state.totalVotes[voteReq.imageId] + (voteReq.vote.value || 0);
			});
		},
		// removeVote(state, action) {
		// 	const oldVote = state.myVotes[action.payload];

		// 	state.totalVotes[action.payload] = state.totalVotes[action.payload] - (oldVote.value || 0);
		// 	delete state.myVotes[action.payload];
		// },
	},
	extraReducers(builder) {
		// Up vote
		builder
			.addCase(upVote.fulfilled, (state, action) => {
				// Update votes with the vote id
				// state.myVotes[action.meta.arg] = { voteId: action.payload.id, value: 1 };
			})
			.addCase(upVote.rejected, (state, action) => {
				// Remove imageId from vote if the action fails and reduce count
				state.totalVotes[action.meta.arg] = state.totalVotes[action.meta.arg] - 1;
				// delete state.myVotes[action.meta.arg];
			});

		// Down vote
		builder
			.addCase(downVote.fulfilled, (state, action) => {
				// Update votes with the vote id
				// state.myVotes[action.meta.arg] = { voteId: action.payload.id, value: -1 };
			})
			.addCase(downVote.rejected, (state, action) => {
				// Remove imageId from vote if the action fails and reduce count
				state.totalVotes[action.meta.arg] = state.totalVotes[action.meta.arg] + 1;
				// delete state.myVotes[action.meta.arg];
			});

		// Remove vote
		builder.addCase(clearVote.rejected, (state, action) => {
			// Restore vote if the action fails
			state.totalVotes[action.meta.arg.imageId] = state.totalVotes[action.meta.arg.imageId] + (action.meta.arg.vote.value || 0);
			// state.myVotes[action.meta.arg.imageId] = action.meta.arg.vote;
		});

		// Get votes for my images
		builder
			.addCase(getAllVotes.pending, (state) => {
				state.totalVoteStatus = TaskStatus.Pending;
			})
			.addCase(getAllVotes.fulfilled, (state, action) => {
				state.totalVotes = countVotes(action.payload);
				state.totalVoteStatus = TaskStatus.Succeded;
			})
			.addCase(getAllVotes.rejected, (state) => {
				state.totalVoteStatus = TaskStatus.Failed;
			});
	},
});

// Thunks ==================================================================
// Vote on image
export const upVote = createAsyncThunk('vote/upVote', async (imageId: string, { dispatch }) => {
	dispatch(addVote({ imageId, vote: { voteId: undefined, value: 1 } }));

	return ApiClient.getClient().votes.addVote({ imageId, value: 1 });
});

export const downVote = createAsyncThunk('vote/downVote', async (imageId: string, { dispatch }) => {
	dispatch(addVote({ imageId, vote: { voteId: undefined, value: -1 } }));

	return ApiClient.getClient().votes.addVote({ imageId, value: -1 });
});

// Rmove vote on image
export const clearVote = createAsyncThunk<DeleteFavourite, VoteImageRequest>('favourite/unfavouriteImage', async ({ imageId, vote }, { dispatch }) => {
	// dispatch(removeVote(imageId));

	if (!vote.voteId) {
		throw new Error('Vote ID is undefined');
	}

	return ApiClient.getClient().votes.deleteVote(vote.voteId);
});

// Get votes for my images
export const getAllVotes = createAsyncThunk('gallery/getVotes', async () => {
	return getVotes(undefined, { attachImage: false, limit: 100 });
});

// Actions =================================================================
export const { addVote, bulkAddVotes } = voteSlice.actions;

// Reducer =================================================================
export default voteSlice.reducer;
