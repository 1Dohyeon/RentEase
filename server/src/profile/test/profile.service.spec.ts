import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepository } from '../profile.repository'; // 수정 필요
import { ProfileService } from '../profile.service'; // 수정 필요

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: ProfileRepository; // 수정 필요

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: ProfileRepository, // 수정 필요
          useValue: {
            getUserInfoById: jest.fn(),
            addProfileImage: jest.fn(),
            deleteProfileImage: jest.fn(),
            replaceProfileImage: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get<ProfileRepository>(ProfileRepository); // 수정 필요
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addProfileImage', () => {
    it('should add profile image for a user', async () => {
      const userId = 1;
      const mockUser = { id: userId, username: 'testuser' };
      const mockProfileImageUrl = 'test/profile-image.jpg';

      // Mock the repository methods
      jest
        .spyOn(profileRepository, 'getUserInfoById')
        .mockResolvedValue(mockUser); // 수정 필요
      jest
        .spyOn(profileRepository, 'addProfileImage')
        .mockResolvedValue(mockUser); // 수정 필요
      jest.spyOn(profileRepository, 'save').mockResolvedValue(mockUser); // 수정 필요

      // Call the service method
      const result = await service.addProfileImage(userId, mockProfileImageUrl);

      // Assert expectations
      expect(profileRepository.getUserInfoById).toHaveBeenCalledWith(userId); // 수정 필요
      expect(profileRepository.addProfileImage).toHaveBeenCalledWith(
        mockUser,
        mockProfileImageUrl,
      );
      expect(profileRepository.save).toHaveBeenCalledWith(mockUser); // 수정 필요
      expect(result).toEqual(mockUser); // Adjust this based on your UserProfile structure
    });

    // Add more tests as needed for edge cases and error handling
  });

  describe('deleteProfileImage', () => {
    it('should delete profile image for a user', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        username: 'testuser',
        profileImage: 'test/profile-image.jpg',
      };

      // Mock the repository methods
      jest
        .spyOn(profileRepository, 'getUserInfoById')
        .mockResolvedValue(mockUser); // 수정 필요
      jest
        .spyOn(profileRepository, 'deleteProfileImage')
        .mockResolvedValue(mockUser); // 수정 필요
      jest.spyOn(profileRepository, 'save').mockResolvedValue(mockUser); // 수정 필요

      // Call the service method
      const result = await service.deleteProfileImage(userId);

      // Assert expectations
      expect(profileRepository.getUserInfoById).toHaveBeenCalledWith(userId); // 수정 필요
      expect(profileRepository.deleteProfileImage).toHaveBeenCalledWith(
        mockUser,
      ); // 수정 필요
      expect(profileRepository.save).toHaveBeenCalledWith(mockUser); // 수정 필요
      expect(result).toEqual(mockUser); // Adjust this based on your UserProfile structure
    });

    // Add more tests as needed for edge cases and error handling
  });

  describe('replaceProfileImage', () => {
    it('should replace profile image for a user', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        username: 'testuser',
        profileImage: 'test/profile-image.jpg',
      };
      const mockNewProfileImageUrl = 'test/new-profile-image.jpg';

      // Mock the repository methods
      jest
        .spyOn(profileRepository, 'getUserInfoById')
        .mockResolvedValue(mockUser); // 수정 필요
      jest
        .spyOn(profileRepository, 'replaceProfileImage')
        .mockResolvedValue(mockUser); // 수정 필요
      jest.spyOn(profileRepository, 'save').mockResolvedValue(mockUser); // 수정 필요

      // Call the service method
      const result = await service.replaceProfileImage(
        userId,
        mockNewProfileImageUrl,
      );

      // Assert expectations
      expect(profileRepository.getUserInfoById).toHaveBeenCalledWith(userId); // 수정 필요
      expect(profileRepository.replaceProfileImage).toHaveBeenCalledWith(
        mockUser,
        mockNewProfileImageUrl,
      );
      expect(profileRepository.save).toHaveBeenCalledWith(mockUser); // 수정 필요
      expect(result).toEqual(mockUser); // Adjust this based on your UserProfile structure
    });

    // Add more tests as needed for edge cases and error handling
  });
});
