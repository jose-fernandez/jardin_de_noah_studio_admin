import React from "react";
import { useState, useEffect } from "react";

import { useTranslate, HttpError } from "@refinedev/core";
import { useAutocomplete, Edit } from "@refinedev/mui";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";

import CloseIcon from "@mui/icons-material/Close";

import { ICategory, IFile, IProduct, Nullable } from "../../interfaces";
import { supabaseClient } from "@/utility";

export const EditProduct: React.FC<
    UseModalFormReturnType<IProduct, HttpError, Nullable<IProduct>>
> = ({
    watch,
    setValue,
    updateCategories,
    register,
    formState: { errors },
    control,
    refineCore: { onFinish, queryResult },
    handleSubmit,
    modal: { visible, close },
    saveButtonProps,
    getValues,
}) => {
    const t = useTranslate();
    const [editCategoriesFulfilled, setEditCategoriesFulfilled] = useState<boolean>(true);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const { autocompleteProps } = useAutocomplete<ICategory>({
        resource: "categories",
    });

    useEffect(() => {
        if (queryResult?.data) {
            setCategories(queryResult.data?.data?.categories)
        }
      }, [queryResult?.data, visible]);

    useEffect(() => {
        return () => setCategories([])
    }, [visible]);

    const imageInput = watch("images");

    const onChangeHandler = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const target = event.target;
        const file: File = (target.files as FileList)[0];

        await supabaseClient.storage
            .from("products")
            .upload(`${file.name}`, file);

        const { data } =
            await supabaseClient.storage
                .from("products")
                .getPublicUrl(
                    `${file.name}`,
                );

        const { name, size, type, lastModified } = file;

        const imagePaylod: any = [
            {
                name,
                size,
                type,
                lastModified,
                url: data.publicUrl,
            },
        ];

        setValue("images", imagePaylod, { shouldValidate: true });
    };

    return (
        <Drawer
            sx={{ zIndex: "1301" }}
            PaperProps={{ sx: { width: { sm: "100%", md: 500 } } }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Edit
                saveButtonProps={saveButtonProps}
                headerProps={{
                    avatar: (
                        <IconButton
                            onClick={() => close()}
                            sx={{ width: "30px", height: "30px", mb: "5px" }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ),
                    action: null,
                }}
                wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
            >
                <Stack>
                    <Box
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="50px"
                        sx={{
                            paddingX: {
                                xs: 1,
                                md: 6,
                            },
                        }}
                    >
                        <form onSubmit={handleSubmit(onFinish)}>
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel required>
                                    {t("products.fields.images.label")}
                                </FormLabel>
                                <Stack
                                    display="flex"
                                    alignItems="center"
                                    border="1px dashed  "
                                    borderColor="primary.main"
                                    borderRadius="5px"
                                    padding="10px"
                                    marginTop="5px"
                                >
                                    <label htmlFor="images-input">
                                        <Input
                                            id="images-input"
                                            type="file"
                                            sx={{
                                                display: "none",
                                            }}
                                            onChange={onChangeHandler}
                                        />
                                        <input
                                            id="file"
                                            {...register("images", {
                                                required: t(
                                                    "errors.required.field",
                                                    { field: "Image" },
                                                ),
                                            })}
                                            type="hidden"
                                        />
                                        <Avatar
                                            sx={{
                                                cursor: "pointer",
                                                width: {
                                                    xs: 100,
                                                    md: 180,
                                                },
                                                height: {
                                                    xs: 100,
                                                    md: 180,
                                                },
                                            }}
                                            src={
                                                (imageInput as IFile[]) &&
                                                (imageInput as IFile[])[0].url
                                            }
                                            alt="Store Location"
                                        />
                                    </label>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 800,
                                            marginTop: "8px",
                                        }}
                                    >
                                        {t(
                                            "products.fields.images.description",
                                        )}
                                    </Typography>
                                    <Typography style={{ fontSize: "12px" }}>
                                        {t("products.fields.images.validation")}
                                    </Typography>
                                </Stack>
                                {errors.images && (
                                    <FormHelperText error>
                                        {errors.images.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Stack gap="10px" marginTop="10px">
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.name")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="name"
                                        {...register("name", {
                                            required: t(
                                                "errors.required.field",
                                                { field: "Name" },
                                            ),
                                        })}
                                        style={{ height: "40px" }}
                                    />
                                    {errors.name && (
                                        <FormHelperText error>
                                            {errors.name.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.description")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="description"
                                        {...register("description", {
                                            required: t(
                                                "errors.required.field",
                                                { field: "Description" },
                                            ),
                                        })}
                                        multiline
                                        minRows={5}
                                        maxRows={5}
                                    />
                                    {errors.description && (
                                        <FormHelperText error>
                                            {errors.description.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.price")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="price"
                                        {...register("price", {
                                            required: t(
                                                "errors.required.field",
                                                { field: "Price" },
                                            ),
                                        })}
                                        style={{
                                            width: "150px",
                                            height: "40px",
                                        }}
                                        type="number"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                $
                                            </InputAdornment>
                                        }
                                    />
                                    {errors.price && (
                                        <FormHelperText error>
                                            {errors.price.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <Controller
                                        control={control}
                                        name={editCategoriesFulfilled ? "" : "categories"}
                                        ref={null}
                                        rules={{
                                            required: editCategoriesFulfilled 
                                                ? false
                                                : t("errors.required.field", { field: "Category" })
                                        }}
                                        render={({field}) => (
                                            <Autocomplete
                                                multiple
                                                disablePortal
                                                {...autocompleteProps}
                                                {...field}
                                                value={categories}
                                                key={`categories-key-${visible}`}
                                                onChange={(_, value: ICategory[]) => {
                                                    setEditCategoriesFulfilled(!!value.length)
                                                    setCategories(value);
                                                    updateCategories(value.map(({id}) => id))
                                                    if (!value.length) field.onChange(undefined)
                                                }}
                                                getOptionLabel={(item) => {
                                                    return item.title
                                                        ? item.title
                                                        : "";
                                                }}
                                                isOptionEqualToValue={(
                                                    option,
                                                    value,
                                                ) =>
                                                    value === undefined ||
                                                    option?.id?.toString() ===
                                                        (
                                                            value?.id ?? value
                                                        )?.toString()
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Category"
                                                        variant="outlined"
                                                        error={
                                                            !!errors.categories
                                                                ?.message
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.categories && (
                                        <FormHelperText error>
                                            {errors.categories.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.isActive")}
                                    </FormLabel>
                                    <Controller
                                        control={control}
                                        {...register("isActive")}
                                        ref={null}
                                        defaultValue={false}
                                        render={({ field }) => {
                                            return (
                                                <RadioGroup
                                                    id="isActive"
                                                    defaultValue={getValues(
                                                        "isActive",
                                                    )}
                                                    {...field}
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value ===
                                                            "true";

                                                        setValue(
                                                            "isActive",
                                                            value,
                                                            {
                                                                shouldValidate:
                                                                    true,
                                                            },
                                                        );

                                                        return value;
                                                    }}
                                                    row
                                                >
                                                    <FormControlLabel
                                                        value={true}
                                                        control={<Radio />}
                                                        label={t(
                                                            "status.enable",
                                                        )}
                                                    />
                                                    <FormControlLabel
                                                        value={false}
                                                        control={<Radio />}
                                                        label={t(
                                                            "status.disable",
                                                        )}
                                                    />
                                                </RadioGroup>
                                            );
                                        }}
                                    />
                                    {errors.isActive && (
                                        <FormHelperText error>
                                            {errors.isActive.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Edit>
        </Drawer>
    );
};
