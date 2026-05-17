/**
 * Guest Routes
 * API endpoints for guest registration and management
 */

import { Router, Request, Response } from 'express';
import { GuestService } from '../services/guest.service';
import { ResponseBuilder } from '../models/response.model';
import { CreateGuestRequest, Property } from '../models/guest.model';

const router = Router();

/**
 * POST /api/v1/guests
 * Create a new guest registration
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const guestData: CreateGuestRequest = req.body;

    // Create guest
    const guest = await GuestService.createGuest(guestData);

    res.status(201).json(
      ResponseBuilder.success(guest, 'Guest registered successfully')
    );
  } catch (error: any) {
    console.error('Error creating guest:', error);

    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json(
        ResponseBuilder.validationError(error.errors)
      );
    }

    res.status(500).json(
      ResponseBuilder.internalError('Failed to create guest registration')
    );
  }
});

/**
 * GET /api/v1/guests
 * Get all guests with pagination and filters
 * Query params: property, search, room_number, status, arrival_date_from, arrival_date_to, page, limit
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = {
      property: req.query.property as Property,
      search: req.query.search as string,
      room_number: req.query.room_number as string,
      status: req.query.status as any,
      arrival_date_from: req.query.arrival_date_from as string,
      arrival_date_to: req.query.arrival_date_to as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await GuestService.getGuests(query);

    res.json(ResponseBuilder.success(result));
  } catch (error: any) {
    console.error('Error fetching guests:', error);
    res.status(500).json(
      ResponseBuilder.internalError('Failed to fetch guests')
    );
  }
});

/**
 * GET /api/v1/guests/today
 * Get today's registrations for a property
 * Query params: property (required)
 */
router.get('/today', async (req: Request, res: Response) => {
  try {
    const property = req.query.property as Property;

    if (!property || (property !== 'plaza' && property !== 'century')) {
      return res.status(400).json(
        ResponseBuilder.error('INVALID_PROPERTY', 'Property must be "plaza" or "century"')
      );
    }

    const guests = await GuestService.getTodayGuests(property);

    res.json(ResponseBuilder.success(guests));
  } catch (error: any) {
    console.error('Error fetching today\'s guests:', error);
    res.status(500).json(
      ResponseBuilder.internalError('Failed to fetch today\'s guests')
    );
  }
});

/**
 * GET /api/v1/guests/stats
 * Get dashboard statistics for a property
 * Query params: property (required)
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const property = req.query.property as Property;

    if (!property || (property !== 'plaza' && property !== 'century')) {
      return res.status(400).json(
        ResponseBuilder.error('INVALID_PROPERTY', 'Property must be "plaza" or "century"')
      );
    }

    const stats = await GuestService.getDashboardStats(property);

    res.json(ResponseBuilder.success(stats));
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json(
      ResponseBuilder.internalError('Failed to fetch statistics')
    );
  }
});

/**
 * GET /api/v1/guests/search
 * Search guests
 * Query params: q (search term), property
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    const property = req.query.property as Property;

    if (!searchTerm) {
      return res.status(400).json(
        ResponseBuilder.error('MISSING_SEARCH_TERM', 'Search term is required')
      );
    }

    const result = await GuestService.getGuests({
      search: searchTerm,
      property,
      page: 1,
      limit: 50
    });

    res.json(ResponseBuilder.success(result));
  } catch (error: any) {
    console.error('Error searching guests:', error);
    res.status(500).json(
      ResponseBuilder.internalError('Failed to search guests')
    );
  }
});

/**
 * GET /api/v1/guests/:id
 * Get a single guest by ID
 * Query params: property (optional, for additional security)
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = req.query.property as Property;

    const guest = await GuestService.getGuestById(id, property);

    if (!guest) {
      return res.status(404).json(
        ResponseBuilder.notFound('Guest')
      );
    }

    res.json(ResponseBuilder.success(guest));
  } catch (error: any) {
    console.error('Error fetching guest:', error);
    res.status(500).json(
      ResponseBuilder.internalError('Failed to fetch guest')
    );
  }
});

/**
 * PUT /api/v1/guests/:id
 * Update a guest record
 * Query params: property (optional, for additional security)
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = req.query.property as Property;
    const updates = req.body;

    const guest = await GuestService.updateGuest(id, updates, property);

    res.json(
      ResponseBuilder.success(guest, 'Guest updated successfully')
    );
  } catch (error: any) {
    console.error('Error updating guest:', error);

    if (error.code === 'NOT_FOUND') {
      return res.status(404).json(
        ResponseBuilder.notFound('Guest')
      );
    }

    res.status(500).json(
      ResponseBuilder.internalError('Failed to update guest')
    );
  }
});

/**
 * POST /api/v1/guests/:id/checkout
 * Check out a guest
 * Query params: property (optional, for additional security)
 */
router.post('/:id/checkout', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = req.query.property as Property;

    const guest = await GuestService.checkoutGuest(id, property);

    res.json(
      ResponseBuilder.success(guest, 'Guest checked out successfully')
    );
  } catch (error: any) {
    console.error('Error checking out guest:', error);

    if (error.code === 'NOT_FOUND') {
      return res.status(404).json(
        ResponseBuilder.notFound('Guest')
      );
    }

    res.status(500).json(
      ResponseBuilder.internalError('Failed to check out guest')
    );
  }
});

/**
 * DELETE /api/v1/guests/:id
 * Soft delete a guest (mark as cancelled)
 * Query params: property (optional, for additional security)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = req.query.property as Property;

    await GuestService.deleteGuest(id, property);

    res.json(
      ResponseBuilder.success(null, 'Guest deleted successfully')
    );
  } catch (error: any) {
    console.error('Error deleting guest:', error);

    if (error.code === 'NOT_FOUND') {
      return res.status(404).json(
        ResponseBuilder.notFound('Guest')
      );
    }

    res.status(500).json(
      ResponseBuilder.internalError('Failed to delete guest')
    );
  }
});

export default router;
