import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import EditIcon from "@mui/icons-material/Edit";
import { GetMyTrips, GetUserProfile, UpdateUserProfile, UploadProfileImage } from "../../../ApiCall";
import { useNavigate } from "react-router-dom";

const HERO_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

const PageShell = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  background:
    "radial-gradient(circle at top left, rgba(107, 142, 35, 0.18), transparent 30%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 32%), linear-gradient(180deg, #061019 0%, #0b1220 42%, #111827 100%)",
  color: "#f8fafc",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

const Surface = styled(Paper)(() => ({
  background: "rgba(9, 14, 24, 0.76)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 28,
  overflow: "hidden",
  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  color: "#f8fafc",
}));

const DisplayCard = styled(Card)(() => ({
  background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,250,252,0.92))",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 24,
  color: "#0f172a",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
}));

const SettingsCard = styled(Card)(() => ({
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 24,
  color: "#0f172a",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
}));

const SummaryTile = styled(Box)(() => ({
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(15, 23, 42, 0.08)",
  borderRadius: 20,
  padding: 18,
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
}));

const Label = styled(Typography)(() => ({
  color: "rgba(15, 23, 42, 0.58)",
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontWeight: 800,
}));

const Value = styled(Typography)(() => ({
  color: "#0f172a",
  fontSize: "1.02rem",
  fontWeight: 700,
  lineHeight: 1.45,
}));

const MutedText = styled(Typography)(() => ({
  color: "rgba(15, 23, 42, 0.76)",
  lineHeight: 1.8,
}));

const filterChipSx = {
  borderRadius: 999,
  fontWeight: 700,
  px: 0.5,
};

const lightFieldSx = {
  "& .MuiInputLabel-root": {
    color: "rgba(15, 23, 42, 0.72)",
    fontWeight: 600,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#6B8E23",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 3,
    color: "#0f172a",
    "& fieldset": {
      borderColor: "rgba(15, 23, 42, 0.18)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(107, 142, 35, 0.55)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6B8E23",
      borderWidth: 2,
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#0f172a",
    WebkitTextFillColor: "#0f172a",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#0f172a",
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(15, 23, 42, 0.68)",
  },
};

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  birthday: "",
  imageUrl: "",
  bio: "",
  location: "",
  age: "",
  travelStyle: "",
  interests: "",
  languages: "",
  coverPhotoUrl: "",
  isProfileComplete: false,
};

const listToText = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value || "";
};

const parseCsv = (value) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const normalizeDateInput = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const ddMmYyyy = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (ddMmYyyy) {
    const [, dd, mm, yyyy] = ddMmYyyy;
    return `${yyyy}-${mm}-${dd}`;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return "";
};

const toFormState = (profile) => ({
  ...emptyProfile,
  ...profile,
  coverPhotoUrl: profile?.coverPhotoUrl || profile?.coverImage || profile?.coverPhoto || "",
  birthday: normalizeDateInput(profile?.birthday),
  age: profile?.age ?? "",
  interests: listToText(profile?.interests),
  languages: listToText(profile?.languages),
});

const UserProfile = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [myTrips, setMyTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  const avatarSrc = useMemo(() => previewUrl || profile.imageUrl || "", [previewUrl, profile.imageUrl]);
  const coverPhotoSrc = useMemo(() => coverPreviewUrl || profile.coverPhotoUrl || HERO_IMAGE, [coverPreviewUrl, profile.coverPhotoUrl]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const response = await GetUserProfile();

      if (response?.status === 200 && response.data) {
        const nextProfile = toFormState(response.data);
        setProfile(nextProfile);
        setDraft(nextProfile);
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.message || response?.data?.msg || "Unable to load profile.",
          severity: "error",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const loadMyTrips = async () => {
      setTripsLoading(true);
      const response = await GetMyTrips();

      if (response?.status === 200 && Array.isArray(response.data)) {
        setMyTrips(response.data);
      } else {
        setMyTrips([]);
      }

      setTripsLoading(false);
    };

    loadMyTrips();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [previewUrl, coverPreviewUrl]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    // Auto-upload immediately after selection
    handleUploadPhotoFile(file);
  };

  const handleUploadPhotoFile = async (file) => {
    if (!file) return;

    setUploading(true);
    const response = await UploadProfileImage(file);

    if (response?.status === 200 && response.data?.imageUrl) {
      const imageUrl = response.data.imageUrl;
      setProfile((prev) => ({ ...prev, imageUrl }));
      setDraft((prev) => ({ ...prev, imageUrl }));
      setSelectedFile(null);
      setPreviewUrl("");
      setSnackbar({ open: true, message: "Profile photo updated.", severity: "success" });
    } else {
      // Upload failed — clear the preview so stale blob isn't shown
      setSelectedFile(null);
      setPreviewUrl("");
      setSnackbar({
        open: true,
        message: response?.data?.message || response?.data?.msg || "Photo upload failed.",
        severity: "error",
      });
    }

    setUploading(false);
  };

  const handleUploadPhoto = async () => {
    await handleUploadPhotoFile(selectedFile);
  };

  const handleCoverFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedCoverFile(file);
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverPreviewUrl(URL.createObjectURL(file));
    handleUploadCoverPhoto(file);
  };

  const handleUploadCoverPhoto = async (fileOverride) => {
    const fileToUpload = fileOverride || selectedCoverFile;
    if (!fileToUpload) {
      setSnackbar({ open: true, message: "Choose a cover photo first.", severity: "warning" });
      return;
    }

    setCoverUploading(true);
    const uploadResponse = await UploadProfileImage(fileToUpload);

    if (uploadResponse?.status === 200 && uploadResponse.data?.imageUrl) {
      const nextCoverPhotoUrl = uploadResponse.data.imageUrl;
      const updateResponse = await UpdateUserProfile({ coverPhotoUrl: nextCoverPhotoUrl });

      if (updateResponse?.status === 200 && updateResponse.data) {
        const nextProfile = toFormState(updateResponse.data);
        setProfile(nextProfile);
        setDraft(nextProfile);
      } else {
        setProfile((current) => ({ ...current, coverPhotoUrl: nextCoverPhotoUrl }));
        setDraft((current) => ({ ...current, coverPhotoUrl: nextCoverPhotoUrl }));
      }

      setSelectedCoverFile(null);
      setCoverPreviewUrl("");
      setSnackbar({ open: true, message: "Cover photo updated.", severity: "success" });
    } else {
      setSnackbar({
        open: true,
        message: uploadResponse?.data?.message || uploadResponse?.data?.msg || "Cover photo upload failed.",
        severity: "error",
      });
    }

    setCoverUploading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    const payload = {
      name: draft.name?.trim(),
      phone: draft.phone?.trim(),
      address: draft.address?.trim(),
      gender: draft.gender?.trim(),
      birthday: normalizeDateInput(draft.birthday) || undefined,
      bio: draft.bio?.trim(),
      location: draft.location?.trim(),
      age: draft.age === "" ? undefined : Number(draft.age),
      travelStyle: draft.travelStyle?.trim(),
      interests: draft.interests ? parseCsv(draft.interests) : undefined,
      languages: draft.languages ? parseCsv(draft.languages) : undefined,
      coverPhotoUrl: draft.coverPhotoUrl?.trim() || undefined,
    };

    const response = await UpdateUserProfile(payload);

    if (response?.status === 200 && response.data) {
      const nextProfile = toFormState(response.data);
      setProfile(nextProfile);
      setDraft(nextProfile);
      setEditOpen(false);
      setSnackbar({ open: true, message: "Profile saved successfully.", severity: "success" });
    } else {
      setSnackbar({
        open: true,
        message: response?.data?.message || response?.data?.msg || "Unable to save profile.",
        severity: "error",
      });
    }

    setSaving(false);
  };

  const renderOverview = () => (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {[
          { label: "Name", value: profile.name || "Not set" },
          { label: "Email", value: profile.email || "Not set" },
          { label: "Phone", value: profile.phone || "Add phone number" },
          { label: "Location", value: profile.location || "Add location" },
        ].map((item) => (
          <SummaryTile key={item.label}>
            <Label>{item.label}</Label>
            <Value sx={{ mt: 1 }}>{item.value}</Value>
          </SummaryTile>
        ))}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <DisplayCard sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.25}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Interests & languages
                </Typography>
                <Box>
                  <Label>Interests</Label>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
                    {(profile.interests ? parseCsv(profile.interests) : []).length > 0 ? (
                      parseCsv(profile.interests).map((interest) => (
                        <Chip
                          key={interest}
                          label={interest}
                          sx={{
                            backgroundColor: "rgba(107, 142, 35, 0.12)",
                            color: "#33501b",
                            border: "1px solid rgba(107, 142, 35, 0.25)",
                            fontWeight: 700,
                          }}
                        />
                      ))
                    ) : (
                      <MutedText>No interests added yet.</MutedText>
                    )}
                  </Stack>
                </Box>
                <Box>
                  <Label>Languages</Label>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.25 }}>
                    {(profile.languages ? parseCsv(profile.languages) : []).length > 0 ? (
                      parseCsv(profile.languages).map((language) => (
                        <Chip
                          key={language}
                          label={language}
                          sx={{
                            backgroundColor: "rgba(15, 23, 42, 0.06)",
                            color: "#0f172a",
                            border: "1px solid rgba(15, 23, 42, 0.1)",
                            fontWeight: 700,
                          }}
                        />
                      ))
                    ) : (
                      <MutedText>No languages added yet.</MutedText>
                    )}
                  </Stack>
                </Box>
                <Divider sx={{ borderColor: "rgba(15, 23, 42, 0.08)" }} />
                <Chip
                  label={profile.isProfileComplete ? "Profile complete" : "Profile incomplete"}
                  color={profile.isProfileComplete ? "success" : "warning"}
                  sx={{ alignSelf: "flex-start", fontWeight: 700 }}
                />
              </Stack>
            </CardContent>
          </DisplayCard>
        </Grid>
      </Grid>
    </Stack>
  );

  const renderTrips = () => (
    <Stack spacing={3}>
      <DisplayCard>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={1.5}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Trips
            </Typography>
            <MutedText>Only trips created by this profile are shown here.</MutedText>
          </Stack>
        </CardContent>
      </DisplayCard>

      {tripsLoading ? (
        <DisplayCard>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={26} />
            </Stack>
          </CardContent>
        </DisplayCard>
      ) : myTrips.length === 0 ? (
        <DisplayCard>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Alert severity="info" sx={{ background: "rgba(107, 142, 35, 0.08)", color: "#33501b" }}>
              No trips created by this profile yet.
            </Alert>
          </CardContent>
        </DisplayCard>
      ) : (
        <DisplayCard>
          <CardContent sx={{ p: { xs: 1.25, md: 1.75 } }}>
            {myTrips.filter((trip) => Boolean(trip.imageUrl)).length === 0 ? (
              <Alert severity="info" sx={{ m: 1, background: "rgba(107, 142, 35, 0.08)", color: "#33501b" }}>
                No trip photos attached yet.
              </Alert>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
                  gap: 1,
                }}
              >
                {myTrips
                  .filter((trip) => Boolean(trip.imageUrl))
                  .map((trip) => (
                    <Box
                      key={trip.id}
                      onClick={() => navigate(`/posts/${trip.id}`)}
                      sx={{
                        position: "relative",
                        width: "100%",
                        pt: "100%",
                        borderRadius: 2,
                        overflow: "hidden",
                        backgroundColor: "rgba(15,23,42,0.08)",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        component="img"
                        src={trip.imageUrl}
                        alt={trip.destination || "Trip photo"}
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                          backgroundColor: "rgba(2, 6, 23, 0.72)",
                          color: "#fff",
                          px: 1,
                          py: 0.45,
                          borderRadius: 1,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          maxWidth: "85%",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {trip.destination || "Destination"}
                      </Box>
                    </Box>
                  ))}
              </Box>
            )}
          </CardContent>
        </DisplayCard>
      )}
    </Stack>
  );

  const renderSettings = () => (
    <Stack spacing={3}>
      <SettingsCard>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Other details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" name="name" value={draft.name || ""} onChange={handleFieldChange} sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" name="phone" value={draft.phone || ""} onChange={handleFieldChange} sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" name="address" value={draft.address || ""} onChange={handleFieldChange} sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Gender" name="gender" value={draft.gender || ""} onChange={handleFieldChange} sx={lightFieldSx}>
                  <MenuItem value="">Select gender</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Birthday" name="birthday" value={draft.birthday || ""} onChange={handleFieldChange} InputLabelProps={{ shrink: true }} sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Age" name="age" value={draft.age || ""} onChange={handleFieldChange} sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Location" name="location" value={draft.location || ""} onChange={handleFieldChange} sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Travel style" name="travelStyle" value={draft.travelStyle || ""} onChange={handleFieldChange} placeholder="Adventure, luxury, backpacking..." sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cover photo URL"
                  name="coverPhotoUrl"
                  value={draft.coverPhotoUrl || ""}
                  onChange={handleFieldChange}
                  placeholder="https://example.com/cover-photo.jpg"
                  sx={lightFieldSx}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline minRows={4} label="Bio" name="bio" value={draft.bio || ""} onChange={handleFieldChange} sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Interests" name="interests" value={draft.interests || ""} onChange={handleFieldChange} placeholder="trekking, food, photography" sx={lightFieldSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Languages" name="languages" value={draft.languages || ""} onChange={handleFieldChange} placeholder="English, Hindi, French" sx={lightFieldSx} />
              </Grid>
            </Grid>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                onClick={handleSaveProfile}
                disabled={saving}
                sx={{ backgroundColor: "#6B8E23", "&:hover": { backgroundColor: "#5a7a1c" } }}
              >
                {saving ? "Saving..." : "Save profile details"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setDraft(profile)}
                sx={{ color: "#0f172a", borderColor: "rgba(15, 23, 42, 0.18)", backgroundColor: "rgba(15, 23, 42, 0.03)" }}
              >
                Reset changes
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </SettingsCard>
    </Stack>
  );

  const tabContent = () => {
    if (tab === 1) return renderTrips();
    return renderOverview();
  };

  return (
    <PageShell>
      <Box sx={{ position: "fixed", top: { xs: 78, md: 88 }, left: { xs: 14, md: 20 }, zIndex: 1600 }}>
        <Tooltip title="Edit profile">
          <IconButton
            aria-label="edit-profile"
            onClick={() => setEditOpen(true)}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "rgba(2, 6, 23, 0.82)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
              "&:hover": {
                backgroundColor: "#111827",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Surface>
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 360, md: 420 },
            backgroundImage: `linear-gradient(180deg, rgba(7, 10, 19, 0.15), rgba(7, 10, 19, 0.82)), url(${coverPhotoSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(4,8,15,0.08), rgba(4,8,15,0.76))",
            }}
          />
          <input hidden type="file" accept="image/*" onChange={handleCoverFileChange} id="cover-upload" />
          <Tooltip title="Update cover photo">
            <span>
              <IconButton
                component="label"
                htmlFor="cover-upload"
                disabled={coverUploading}
                sx={{
                  position: "absolute",
                  right: { xs: 12, md: 18 },
                  bottom: { xs: 12, md: 18 },
                  zIndex: 2,
                  width: 44,
                  height: 44,
                  backgroundColor: "#6B8E23",
                  color: "#fff",
                  border: "3px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                  "&:hover": {
                    backgroundColor: "#5a7a1c",
                  },
                }}
              >
                {coverUploading ? <CircularProgress size={22} sx={{ color: "inherit" }} /> : <AddAPhotoIcon sx={{ fontSize: 22 }} />}
              </IconButton>
            </span>
          </Tooltip>
          <Box sx={{ position: "relative", px: { xs: 2.5, md: 5 }, py: { xs: 3, md: 5 } }}>
            <Stack spacing={3} alignItems="center" textAlign="center" sx={{ pt: { xs: 2, md: 4 } }}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Avatar
                  src={avatarSrc || undefined}
                  alt={profile.name || profile.email || "Profile photo"}
                  sx={{ width: 132, height: 132, border: "4px solid rgba(255,255,255,0.92)", boxShadow: "0 18px 40px rgba(0,0,0,0.4)" }}
                >
                  {(profile.name || profile.email || "U").charAt(0).toUpperCase()}
                </Avatar>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="avatar-upload"
                />
                <Tooltip title="Change profile photo">
                  <IconButton
                    component="label"
                    htmlFor="avatar-upload"
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      width: 42,
                      height: 42,
                      backgroundColor: "#6B8E23",
                      color: "#fff",
                      border: "3px solid rgba(255,255,255,0.92)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#5a7a1c",
                        transform: "scale(1.1)",
                      },
                      "&:disabled": {
                        backgroundColor: "rgba(107,142,35,0.5)",
                      },
                    }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <CircularProgress size={24} sx={{ color: "inherit" }} />
                    ) : (
                      <AddAPhotoIcon sx={{ fontSize: 22 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.7 }}>
                  {profile.name || "Your Profile"}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.8)", mt: 1, fontSize: "1.02rem" }}>
                  {profile.email || "Complete your profile details below."}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center">
                <Chip label={profile.isProfileComplete ? "Profile complete" : "Profile incomplete"} color={profile.isProfileComplete ? "success" : "warning"} sx={filterChipSx} />
                {profile.location ? <Chip label={profile.location} sx={{ ...filterChipSx, backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }} /> : null}
                {profile.travelStyle ? <Chip label={profile.travelStyle} sx={{ ...filterChipSx, backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }} /> : null}
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ px: { xs: 2, md: 5 }, pb: 5, mt: -6, position: "relative", zIndex: 1 }}>
          <Tabs
            value={tab}
            onChange={(_, nextTab) => setTab(nextTab)}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              mb: 3,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 999,
                backgroundColor: '#6B8E23',
              },
            }}
          >
            <Tab label="Overview" sx={{ color: 'rgba(255,255,255,0.72)', fontWeight: 800, '&.Mui-selected': { color: '#fff' } }} />
            <Tab label="Trips" sx={{ color: 'rgba(255,255,255,0.72)', fontWeight: 800, '&.Mui-selected': { color: '#fff' } }} />
          </Tabs>

          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
              <CircularProgress color="inherit" />
            </Stack>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                {tabContent()}
              </Grid>

              {tab !== 1 ? (
                <Grid item xs={12} lg={4}>
                  <Stack spacing={2.5}>
                    <DisplayCard>
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack spacing={1.5}>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Quick details
                          </Typography>
                          <MutedText>
                            A compact snapshot of the profile data.
                          </MutedText>
                        </Stack>
                      </CardContent>
                    </DisplayCard>

                    {[
                      { label: 'Location', value: profile.location || 'Not set' },
                      { label: 'Travel style', value: profile.travelStyle || 'Not set' },
                      { label: 'Age', value: profile.age || 'Not set' },
                      { label: 'Status', value: profile.isProfileComplete ? 'Complete' : 'Incomplete' },
                    ].map((item) => (
                      <SummaryTile key={item.label}>
                        <Label>{item.label}</Label>
                        <Value sx={{ mt: 1 }}>{item.value}</Value>
                      </SummaryTile>
                    ))}

                    <DisplayCard>
                      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                        <Stack spacing={1.25}>
                          <Label>Profile state</Label>
                          <Chip
                            label={profile.isProfileComplete ? 'Complete' : 'Incomplete'}
                            color={profile.isProfileComplete ? 'success' : 'warning'}
                            sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                          />
                        </Stack>
                      </CardContent>
                    </DisplayCard>
                  </Stack>
                </Grid>
              ) : null}
            </Grid>
          )}
        </Box>
      </Surface>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a" }}>Edit profile</DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: "#f8fafc" }}>
          {renderSettings()}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageShell>
  );
};

export default UserProfile;
