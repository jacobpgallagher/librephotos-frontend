import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "tabler-icons-react";

import { fetchAlbumDate, fetchAlbumDateList } from "../../actions/albumsActions";
import { PhotoListView } from "../../components/photolist/PhotoListView";
import { PhotosetType } from "../../reducers/photosReducer";
import type { PhotosState } from "../../reducers/photosReducer";
import { useAppDispatch, useAppSelector } from "../../store/store";

type Props = {
  match: any;
};

type fetchedGroup = {
  id: string;
  page: number;
};

export function UserPublicPage(props: Props) {
  const { fetchedPhotosetType, photosFlat, photosGroupedByDate } = useAppSelector(state => state.photos as PhotosState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { auth, ui } = useAppSelector(state => state);
  const [group, setGroup] = useState({} as fetchedGroup);

  useEffect(() => {
    if (group.id && group.page) {
      fetchAlbumDate(dispatch, {
        album_date_id: group.id,
        page: group.page,
        photosetType: PhotosetType.PUBLIC,
        username: props.match.params.username,
      });
    }
  }, [group.id, group.page]);

  useEffect(() => {
    fetchAlbumDateList(dispatch, {
      photosetType: PhotosetType.PUBLIC,
      username: props.match.params.username,
    });
  }, [dispatch]); // Only run on first render

  const getAlbums = (visibleGroups: any) => {
    visibleGroups.forEach((group: any) => {
      const visibleImages = group.items;
      if (visibleImages.filter((i: any) => i.isTemp && i.isTemp != undefined).length > 0) {
        const firstTempObject = visibleImages.filter((i: any) => i.isTemp)[0];
        const page = Math.ceil((parseInt(firstTempObject.id) + 1) / 100);
        setGroup({ id: group.id, page: page });
      }
    });
  };

  return (
    <PhotoListView
      //To-Do: Translate this
      title={
        auth.access && auth.access.name === props.match.params.username
          ? "Your public photos"
          : `Public photos of ${props.match.params.username}`
      }
      loading={fetchedPhotosetType !== PhotosetType.PUBLIC}
      icon={<Globe size={50} />}
      isDateView
      photoset={photosGroupedByDate}
      idx2hash={photosFlat}
      isPublic={auth.access === null || auth.access.name !== props.match.params.username}
      updateGroups={getAlbums}
      selectable
    />
  );
}
